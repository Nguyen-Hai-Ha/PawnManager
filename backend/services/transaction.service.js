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
    }   
}