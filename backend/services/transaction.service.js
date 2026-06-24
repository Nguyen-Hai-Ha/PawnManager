const { Transactions, PaymentSchedules, Contract, Collaterals, ContractHistory, AuditLogs, Staff, Template } = require('../models');
const db = require('../config/database');
const { doReadNumber } = require('read-vietnamese-number');
const { generatePaymentReceiptDoc } = require('../services/DocumentService');

const TransactionsService = {
    createTransaction: (data) => {
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
        const collateral = Collaterals.getById(contract.id_collateral);

        // thay đổi trạng thái của tài sản, hợp đồng chuyển từ Quá Hạn -> Đang Cầm
        if (contract.status === 'Quá Hạn') {
            if (contract.id_contract_type === 1) {
                Contract.updateStatus({ status: 'Đang Cầm' }, data.id_contract);
            } else {
                Contract.updateStatus({ status: 'Đang Vay' }, data.id_contract);
            }
            // tài sản quá hạn -> đang cầm
            if (contract.id_contract_type === 1 && collateral.status === 'Quá Hạn') {
                Collaterals.updateStatus({ status: 'Đang Cầm' }, contract.id_collateral);
            } 
        }
        // thay đổi trạng thái của tài sản, hợp đồng chuyển từ Chờ Thanh Lý -> Đang Cầm
        else if (contract.status === 'Chờ Thanh Lý') {
            Contract.updateStatus({ status: 'Đang Cầm' }, data.id_contract);
            // tài sản chờ thanh lý có thể thay đổi -> đang cầm nếu khách hàng kịp đóng lãi trong 24h
            if (contract.id_contract_type === 1 && collateral.status === 'Chờ Thanh Lý') {
                Collaterals.updateStatus({ status: 'Đang Cầm' }, contract.id_collateral);
            }
        } 
        // thay đổi trạng thái hợp đồng khi đang cầm, đến lãi, sắp đến hạn
        else {
            const status = (contract.id_contract_type === 1) ? 'Đang Cầm' : 'Đang Vay';
            Contract.updateStatus({ status: status }, data.id_contract);
        }

        // nếu là kỳ cuối cùng thì cập nhật trạng thái hợp đồng và tài sản => hoàn tất
        const isPawnOrCreditFinished = (contract.id_contract_type === 1 || contract.id_contract_type === 2) 
            && contract.total_periods < paymentSchedule.period_number;

        const isInstallmentFinished = (contract.id_contract_type === 3) 
            && contract.total_periods === paymentSchedule.period_number;

        if (isPawnOrCreditFinished || isInstallmentFinished) {
            Contract.updateStatus({ status: 'Đã Hoàn Tất' }, data.id_contract);
            if (contract.id_contract_type === 1) {
                Collaterals.updateStatus({ status: 'Đã Chuộc' }, contract.id_collateral);
            }
        }

        const staff = Staff.getById(data.id_staff);

        const log = AuditLogs.create({
            action: 'Đóng lãi cho Hợp đồng',
            details: `Đóng lãi cho Hợp đồng ${contract.code} kỳ ${paymentSchedule.period_number} với số tiền ${data.amount} bởi nhân viên ${staff.name}`,
            id_staff: data.id_staff,
        });

        return { transaction, paymentSchedule };
    },
    reducePrincipalService: (data) => {
        const exp = db.transaction((data) => {
            const id_contract = data.id_contract;
            const amount = data.amount;
            const payment_date = data.payment_date || new Date().toLocaleDateString('sv-SE');
            const other_fees = data.other_fees || 0;
            const newInterestRate = data.interest_rate;
            const note = data.note;
            const staff = Staff.getById(data.id_staff);

            const contract = Contract.getById(id_contract);
            if (!contract) throw new Error("Hợp đồng không tồn tại");

            const allCSchedule = PaymentSchedules.getByContractId(id_contract);

            // Lấy tất cả kỳ chưa đóng của hợp đồng này (được sắp xếp theo period_number tăng dần)
            const schedules = allCSchedule.filter(s => s.is_paid === 0).sort((a, b) => a.period_number - b.period_number);
            
            // Lấy kỳ đã đóng của hợp đồng này trong trường hợp ngày đóng nằm trong kỳ đã đóng đó
            const paidSchedules = allCSchedule.filter(s => s.is_paid === 1 && s.from_date <= payment_date && payment_date <= s.expected_date).sort((a, b) => a.period_number - b.period_number)

            if (schedules.length === 0) {
                throw new Error("Hợp đồng đã hoàn tất");
            }

            // Kỳ thanh toán hiện tại
            const current_schedule = paidSchedules.length > 0 ? paidSchedules[0] : schedules[0];

            // Tạo giao dịch loại 4 (trả bớt gốc)
            const transaction = Transactions.create({
                amount: amount,
                other_fees: other_fees,
                description: note,
                id_contract: id_contract,
                id_transaction_type: 4, // trả bớt gốc
                id_staff: data.id_staff
            });

            let oldHistoryInterestRate = null;
            let newHistoryInterestRate = null;

            if (newInterestRate > 0) {
                oldHistoryInterestRate = contract.interest_rate;
                newHistoryInterestRate = newInterestRate;
            }

            // Tạo lịch sử thay đổi
            const contractHistory = ContractHistory.create({
                id_transaction: transaction.id,
                id_contract: id_contract,
                id_staff: data.id_staff,
                old_principal: contract.loan_amount,
                new_principal: contract.loan_amount - amount,
                old_interest_rate: oldHistoryInterestRate,
                new_interest_rate: newHistoryInterestRate,
                type: 'reduce_principal',
            });

            // Tính tiền gốc còn lại, tránh trường hợp đã trả bớt gốc trước đó hoặc đóng lãi của HĐ trả góp
            let oldLoanAmount = 0;
            schedules.forEach(schedule => {
                oldLoanAmount += schedule.principal_amount;
            });
            const newLoanAmount = oldLoanAmount - amount;

            // trường hợp nhân viên bị ngu ko dùng tất toán mà trả bớt gốc để thanh toán hết
            if (newLoanAmount <= 0) {
                Contract.updateStatus({ status: 'Đã Hoàn Tất' }, contract.id);
                PaymentSchedules.updateStatus({ is_paid: 1 }, current_schedule.id);
                return { transaction, message: "Hợp đồng đã được tất toán" };
            }

            // Xử lý ngày cho kỳ hiện tại
            const periodStartDate = new Date(current_schedule.from_date);
            const periodEndDate = new Date(current_schedule.expected_date);
            const paymentDate = new Date(payment_date);

            // Hàm tính số ngày giữa 2 ngày
            const countDaysBetween = (start, end) => {
                const s = new Date(start); s.setHours(0, 0, 0, 0);
                const e = new Date(end); e.setHours(0, 0, 0, 0);
                return Math.round((e - s) / (1000 * 60 * 60 * 24));
            };

            // hàm tính lãi
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

            // ngày còn lại
            const days_new = total_days - days_old;

            // lãi mỗi ngày gốc cũ 
            const interest_old_full = current_schedule.interest_amount;
            const interest_per_day_old = (contract.interest_type === 'daily_amount') ? contract.interest_rate : interest_old_full / total_days; // 11,5

            // Lãi mỗi ngày theo gốc MỚI
            const interest_new_full = calculateInterest(newLoanAmount, newInterestRate, contract.interest_type, total_days);
            const interest_per_day_new = (contract.interest_type === 'daily_amount') ? newInterestRate : interest_new_full / total_days; //8,5

            // Lãi kỳ này = (Ngày cũ * Lãi cũ/ngày) + (Ngày mới * Lãi mới/ngày)
            const new_current_period_interest = Math.round((days_old * interest_per_day_old) + (days_new * interest_per_day_new));
            
            // tạo biến surplusInterest nếu đã đóng trước lãi đó và trả BG thì phải lấy lãi cũ - lãi mới = số dư trừ cho kỳ tiếp theo
            let surplusInterest = 0;
            if ( current_schedule.is_paid === 1) {
                surplusInterest = current_schedule.interest_amount - new_current_period_interest;
            }

            let principalAmount = 0;
            // tạo biến principalAmountForCurrent để lưu tiền gốc của kỳ hiện tại
            let principalAmountForCurrent = current_schedule.principal_amount;
            // tổng kỳ hiện tại chưa đóng, nếu hợp đồng trả góp thì bằng với schedules.length, nếu không phải trả góp thì bằng schedules.length -1
            const totalPeriods =  contract.id_contract_type === 3 ? schedules.length : schedules.length -1;
            if (current_schedule.principal_amount > 0 && contract.id_contract_type == 3) {
                principalAmount = Math.floor(newLoanAmount / totalPeriods);
                // nếu kỳ hiện tại chưa đóng thì, cập nhật tiền gốc mới
                if (current_schedule.is_paid === 0) {
                    principalAmountForCurrent = principalAmount;
                }
            }

            // Cập nhật lại số tiền của kỳ hiện tại
            PaymentSchedules.update(current_schedule.id, {
                id_contract: id_contract,
                period_number: current_schedule.period_number,
                from_date: current_schedule.from_date,
                expected_date: current_schedule.expected_date,
                is_paid: current_schedule.is_paid,
                interest_amount: new_current_period_interest,
                principal_amount: principalAmountForCurrent // nếu đã đóng rồi thì giữ nguyên tiền gốc cũ, nếu chưa thì cập nhật tiền gốc mới principalAmountForCurrent = principalAmount
            });

            // tạo biến runningPrincipalSum nếu là trả góp thì tính tổng tiền gốc đã trả
            let runningPrincipalSum = (contract.id_contract_type == 3 && current_schedule.is_paid === 0) ? principalAmountForCurrent : 0;

            // tạo biến startIndex để tránh lỗi khi current lấy paidSchedules[0]
            let startIndex = (current_schedule.is_paid === 1 || current_schedule.is_paid === 2) ? 0 : 1;

            let hasDeductedSurplus = false; // Biến đánh dấu đã trừ tiền dư hay chưa

            // Cập nhật số tiền của các kỳ tiếp theo
            for (let i = startIndex; i < schedules.length; i++) {
                const future_schedule = schedules[i];
                const islastPeriods = (i === schedules.length - 1);

                const future_days = countDaysBetween(future_schedule.from_date, future_schedule.expected_date);
                let future_interest = calculateInterest(newLoanAmount, newInterestRate, contract.interest_type, future_days);

                // nếu có tiền dư và đánh dấu chưa trừ = false thì trừ vào kỳ tiếp theo
                if (surplusInterest > 0 && !hasDeductedSurplus) {
                    if (future_interest - surplusInterest > 0) {
                        future_interest = future_interest - surplusInterest;
                        // set đánh dấu = true tránh trừ các kỳ tiếp theo
                        hasDeductedSurplus = true;
                    }
                    // nếu tiền dư lớn hơn tiền lãi của kỳ tiếp theo (1) thì trừ hết tiền lãi của kỳ tiếp theo và trừ tiếp vào kỳ tiếp theo (2)
                    else if (future_interest - surplusInterest <= 0) {
                        surplusInterest = surplusInterest - future_interest;
                        future_interest = 0;
                        // set đánh dấu = true tránh trừ các kỳ tiếp theo
                        hasDeductedSurplus = true;
                    }
                }

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

            AuditLogs.create({
                action: 'Trả bớt gốc cho Hợp đồng',
                details: `Trả bớt gốc cho Hợp đồng ${contract.code} với số tiền ${amount} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });

            // tiền lãi mới dành cho hợp đồng
            const newLoanForContract = contract.loan_amount - amount;

            // Cập nhật lại số tiền gốc của hợp đồng
            Contract.updateLoanAmount({ loan_amount: newLoanForContract, interest_rate: newInterestRate }, id_contract);

           return { transaction, current_schedule, contractHistory, msg: "Cập nhật gốc và lãi thành công" };
        });
        return exp(data);
    }

}