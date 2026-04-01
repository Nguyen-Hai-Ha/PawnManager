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
    getHistoryPayment: (req, res) => {
        try {
            const transactions = Transactions.getHistoryPayment(req.params.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getHistoryReducePrincipal: (req, res) => {
        try {
            const transactions = Transactions.getHistoryReducePrincipal(req.params.id);
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

            // lấy kỳ lãi tiếp theo
            const nextPaymentSchedule = PaymentSchedules.getById(data.id_schedule + 1);
            const nextInterest = nextPaymentSchedule.interest_amount;
            const nextPrincipal = nextPaymentSchedule.principal_amount;

            if (paymentSchedule.interest_amount + paymentSchedule.principal_amount === data.amount) {
                PaymentSchedules.updateStatus({ is_paid: 1 }, data.id_schedule);
            }
            // nếu đóng dư lãi kỳ hiện tại
            else if (paymentSchedule.interest_amount + paymentSchedule.principal_amount < data.amount) {
                // lấy tiền dư - tiền lãi kỳ tiếp theo
                const id_next_schedule = data.id_schedule + 1;
                let remainingAmount = 0
                if (nextInterest > 0) {
                    // nếu còn kỳ lãi tiếp theo thì trừ tiền lãi kỳ tiếp theo
                    remainingAmount = nextInterest - (data.amount - (paymentSchedule.interest_amount + paymentSchedule.principal_amount));
                    PaymentSchedules.updatePrincipalAmount(id_next_schedule, remainingAmount);
                } else {
                    // nếu không còn kỳ tiếp theo không còn lãi thì trừ tiền gốc kỳ tiếp theo
                    remainingAmount = nextPrincipal - (data.amount - (paymentSchedule.interest_amount + paymentSchedule.principal_amount));
                    PaymentSchedules.updatePrincipalAmount(id_next_schedule, remainingAmount);
                }
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
            const other_fees = data.other_fees || 0;
            const newInterestRate = data.interest_rate;
            const note = data.note;

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
                other_fees: other_fees,
                description: note,
                id_contract: id_contract,
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

            const calculateInterest = (loanAmount, rate, type, days) => {
                if (type === 'daily_amount') {
                    return Math.round(rate * days);
                }
                if (type === 'percent/term') {
                    return Math.round((loanAmount * (rate / 100)) / contract.total_periods);
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
            const interest_per_day_old = (contract.interest_type === 'daily_amount') ? contract.interest_rate : interest_old_full / total_days;

            // Lãi mỗi ngày theo gốc MỚI
            const interest_new_full = calculateInterest(newLoanAmount, newInterestRate, contract.interest_type, total_days);
            const interest_per_day_new = (contract.interest_type === 'daily_amount') ? newInterestRate : interest_new_full / total_days;

            // Lãi kỳ này = (Ngày cũ * Lãi cũ/ngày) + (Ngày mới * Lãi mới/ngày)
            const new_current_period_interest = Math.round((days_old * interest_per_day_old) + (days_new * interest_per_day_new));

            let principalAmount = 0;
            if (current_schedule.principal_amount > 0 && contract.id_contract_type == 3) {
                principalAmount = Math.floor(newLoanAmount / schedules.length);
            }

            // Cập nhật lại số tiền của kỳ hiện tại
            PaymentSchedules.update(current_schedule.id, {
                id_contract: id_contract,
                period_number: current_schedule.period_number,
                from_date: current_schedule.from_date,
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

                const future_days = countDaysBetween(future_schedule.from_date, future_schedule.expected_date);
                let future_interest = calculateInterest(newLoanAmount, newInterestRate, contract.interest_type, future_days);

                let p_amount = 0;
                if (contract.id_contract_type == 3) {
                    // Kỳ cuối của trả góp lấy phần còn lại để khớp 100%
                    p_amount = islastPeriods ? (newLoanAmount - runningPrincipalSum) : principalAmount;
                    runningPrincipalSum += p_amount;
                } else if (islastPeriods && (contract.id_contract_type == 1 || contract.id_contract_type == 2)) {
                    // Hợp đồng cầm đồ bình thường thì gốc nằm ở kỳ cuối
                    // lãi sẽ = 0
                    p_amount = newLoanAmount;
                    future_interest = 0;
                }


                PaymentSchedules.update(future_schedule.id, {
                    id_contract: id_contract,
                    period_number: future_schedule.period_number,
                    from_date: future_schedule.from_date,
                    expected_date: future_schedule.expected_date,
                    is_paid: future_schedule.is_paid,
                    interest_amount: future_interest,
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
    },
    finalsettlement: (req, res) => {
        const final = db.transaction((data) => {
            const amount = data.amount;
            const other_fees = data.other_fees || 0;
            const id_contract = data.id_contract;
            const payment_date = data.payment_date || new Date().toISOString().split('T')[0];
            const id_staff = data.id_staff;

            // Hàm tính số ngày giữa 2 ngày
            const countDaysBetween = (start, end) => {
                const s = new Date(start); s.setHours(0, 0, 0, 0);
                const e = new Date(end); e.setHours(0, 0, 0, 0);
                return Math.round((e - s) / (1000 * 60 * 60 * 24));
            };

            const contract = Contract.getById(id_contract);
            if (!contract) return { error: "Hợp đồng không tồn tại" };

            // Lấy tất cả kỳ chưa đóng của hợp đồng này (được sắp xếp theo period_number tăng dần)
            const schedules = PaymentSchedules.getByContractId(id_contract).filter(s => s.is_paid === 0).sort((a, b) => a.period_number - b.period_number);

            // Kỳ thanh toán hiện tại
            const current_schedule = schedules[0];

            // tính gốc còn lại
            const total = schedules.reduce((acc, schedule) => acc + schedule.principal_amount, 0);

            const start_date = new Date(current_schedule.from_date);
            const end_date = new Date(current_schedule.expected_date);

            const day_used = countDaysBetween(start_date, payment_date);

            const totalDay = countDaysBetween(start_date, end_date)
            // tính lãi / ngày đã qua
            const interest_per_day = current_schedule.interest_amount / totalDay;
            const interest_amount = Math.round(interest_per_day * day_used);

            // kiểm tra số tiền có đủ để tất toán không
            if (amount < (total + interest_amount)) {
                return { error: "Số tiền không đủ để tất toán hợp đồng" };
            }

            if (schedules.length === 0) {
                return { error: "Hợp đồng đã hoàn tất" };
            }
            // Tạo giao dịch loại 3 (tất toán)
            const transaction = Transactions.create({
                amount: amount,
                other_fees: other_fees,
                id_contract: id_contract,
                id_transaction_type: 3,
                id_staff: id_staff
            });

            // Cập nhật trạng thái của hợp đồng
            Contract.updateStatus({ status: 'Đã Hoàn Tất' }, id_contract);

            // Cập nhật trạng thái của tất cả các kỳ
            schedules.forEach(schedule => {
                PaymentSchedules.updateStatus({ is_paid: 1 }, schedule.id);
            });

            return { transaction, current_schedule, msg: "Hợp đồng đã được tất toán" };
        });
        try {
            const result = final(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TransactionsController;