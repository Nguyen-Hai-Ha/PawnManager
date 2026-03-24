const { Transactions, PaymentSchedules, Contract } = require('../models');
const db = require('../config/database');

const TransactionsController = {
    getAll: (req, res) => {
        try {
            const transactions = Transactions.getAll();
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const transaction = Transactions.getById(req.params.id);
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getByContractId: (req, res) => {
        try {
            const transactions = Transactions.getByContractId(req.params.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getByScheduleId: (req, res) => {
        try {
            const transactions = Transactions.getByScheduleId(req.params.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const transaction = Transactions.create(data);

            const paymentSchedule = PaymentSchedules.getById(data.id_schedule);
            if (paymentSchedule.interest_amount + paymentSchedule.principal_amount === data.amount) {
                PaymentSchedules.updateStatus({ is_paid: 1 }, data.id_schedule);
            }

            const contract = Contract.getById(data.id_contract);
            if (contract.id_contract_type === 1 || contract.id_contract_type === 2) {
                if (contract.total_periods < paymentSchedule.period_number) {
                    Contract.updateStatus({ status: 'Đã Hoàn Tất' }, data.id_contract);
                }
            }

            res.json({ transaction, paymentSchedule });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const transaction = Transactions.delete(req.params.id);
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    reducePrincipal: (req, res) => {
        const reduce = db.transaction((data) => {
            const id_contract = data.id_contract;
            const amount = data.amount;
            const payment_date = data.payment_date || new Date().toISOString().split('T')[0];
            const newInterestRate = data.interest_rate;

            const contract = Contract.getById(id_contract);
            if (!contract) return res.status(404).json({ error: "Hợp đồng không tồn tại" });

            // Lấy tất cả kỳ chưa đóng của hợp đồng này (được sắp xếp theo period_number tăng dần)
            const schedules = PaymentSchedules.getByContractId(id_contract).filter(s => s.is_paid === 0).sort((a, b) => a.period_number - b.period_number);

            if (schedules.length === 0) {
                return res.status(400).json({ error: "Hợp đồng đã hoàn tất" });
            }

            // Kỳ thanh toán hiện tại
            const current_schedule = schedules[0];

            // Tạo giao dịch loại 4 (trả bớt gốc)
            const transaction = Transactions.create({
                amount: amount,
                other_fees: 0,
                id_contract: id_contract,
                id_schedule: current_schedule.id,
                id_transaction_type: 4, // trả bớt gốc
                id_staff: data.id_staff
            });

            // Tính Tỷ lệ giảm gốc
            const oldLoanAmount = contract.loan_amount;
            const newLoanAmount = oldLoanAmount - amount;

            // trường hợp nhân viên bị ngu ko dùng tất toán mà trả bớt gốc để thanh toán hết
            if (newLoanAmount <= 0) {
                Contract.updateStatus({ status: 'Đã Hoàn Tất' }, contract.id);
                PaymentSchedules.updateStatus({ is_paid: 1 }, current_schedule.id);
                return res.json({ transaction, message: "Hợp đồng đã được tất toán" });
            }



            // Xử lý chia lãi cho kỳ hiện tại
            const periodStartDate = new Date(current_schedule.from_date);
            const periodEndDate = new Date(current_schedule.expected_date);
            const paymentDate = new Date(payment_date);

            // Hàm tính số ngày giữa 2 ngày
            const countDaysBetween = (start, end) => {
                const s = new Date(start); s.setHours(0, 0, 0, 0);
                const e = new Date(end); e.setHours(0, 0, 0, 0);
                return Math.round((e - s) / (1000 * 60 * 60 * 24));
            };

            const calculateInterest = (loanAmount, rate, type) => {
                if (type === 'daily_amount') {
                    return rate; 
                }
                return Math.round((loanAmount * rate) / 100);
            };

            const total_days = countDaysBetween(periodStartDate, periodEndDate); // Tổng số ngày của kỳ hiện tại
            let days_old = countDaysBetween(periodStartDate, paymentDate); // Số ngày tính gốc cũ

            // Tránh việc ngày khách trả nằm trước đầu kỳ hoặc sau cuối kỳ
            if (days_old < 0) days_old = 0;
            if (days_old > total_days) days_old = total_days;

            const days_new = total_days - days_old;

            // lãi mỗi ngày gốc cũ 
            const interest_old_full = current_schedule.interest_amount; 
            const interest_per_day_old = interest_old_full / total_days;

            // Lãi mỗi ngày theo gốc MỚI
            const interest_new_full = calculateInterest(newLoanAmount, newInterestRate, contract.interest_type);
            const interest_per_day_new = interest_new_full / total_days;

            // Lãi kỳ này = (Ngày cũ * Lãi cũ/ngày) + (Ngày mới * Lãi mới/ngày)
            const new_current_period_interest = Math.round((days_old * interest_per_day_old) + (days_new * interest_per_day_new));

            let principalAmount = 0;
            if(current_schedule.principal_amount > 0 && contract.id_contract_type == 3){
                principalAmount = Math.floor(newLoanAmount / schedules.length);
            }

            // Cập nhật lại số tiền của kỳ hiện tại
            PaymentSchedules.update(current_schedule.id, {
                id_contract: id_contract,
                period_number: current_schedule.period_number,
                expected_date: current_schedule.expected_date,
                is_paid: current_schedule.is_paid,
                interest_amount: new_current_period_interest,
                principal_amount: principalAmount
            });

            let runningPrincipalSum = (contract.id_contract_type == 3) ? principalAmount : 0;

            // Cập nhật số tiền của các kỳ tiếp theo
            for (let i = 1; i < schedules.length; i++) {
                const future_schedule = schedules[i];
                const islastPeriods = (i === schedules.length - 1);

                let p_amount = 0;
                if (contract.id_contract_type == 3) {
                    // Kỳ cuối của trả góp lấy phần còn lại để khớp 100%
                    p_amount = islastPeriods ? (newLoanAmount - runningPrincipalSum) : principalAmount;
                    runningPrincipalSum += p_amount;
                } else if (islastPeriods && (contract.id_contract_type == 1 || contract.id_contract_type == 2)) {
                    // Hợp đồng cầm đồ bình thường thì gốc nằm ở kỳ cuối
                    p_amount = newLoanAmount;
                }

                PaymentSchedules.update(future_schedule.id, {
                    id_contract: id_contract,
                    period_number: future_schedule.period_number,
                    expected_date: future_schedule.expected_date,
                    is_paid: future_schedule.is_paid,
                    interest_amount: interest_new_full,
                    principal_amount: p_amount
                });
            }

            // Cập nhật lại số tiền gốc của hợp đồng
            Contract.updateLoanAmount({ loan_amount: newLoanAmount, interest_rate: newInterestRate }, id_contract);

            res.json({ transaction, current_schedule, msg: "Cập nhật gốc và lãi thành công" });
        });

        try {
            const result = reduce(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TransactionsController;