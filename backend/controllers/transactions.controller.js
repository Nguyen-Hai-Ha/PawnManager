const { Transactions, PaymentSchedules, Contract, Collaterals, ContractHistory, AuditLogs, Staff, Template } = require('../models');
const db = require('../config/database');
const { doReadNumber } = require('read-vietnamese-number');
const { generatePaymentReceiptDoc } = require('../services/DocumentService');
const { TransactionsService } = require('../services/transaction.service');

const TransactionsController = {
    getAll: (req, res) => {
        const transactions = Transactions.getAll();
        res.json(transactions);
    },
    getById: (req, res) => {
        const transaction = Transactions.getById(req.params.id);
        res.json(transaction);
    },
    getByContractId: (req, res) => {
        const transactions = Transactions.getByContractId(req.params.id);
        res.json(transactions);
    },
    getByScheduleId: (req, res) => {
        const transactions = Transactions.getByScheduleId(req.params.id);
        res.json(transactions);
    },
    getHistoryPayment: (req, res) => {
        const transactions = Transactions.getHistoryPayment(req.params.id);
        res.json(transactions);
    },
    getHistoryReducePrincipal: (req, res) => {
        const transactions = Transactions.getHistoryReducePrincipal(req.params.id);
        res.json(transactions);
    },
    create: (req, res) => {
        const data = req.body;
        const result = TransactionsService.createTransaction(data);
        res.json(result);
    },
    delete: (req, res) => {
        const transaction = Transactions.delete(req.params.id);
        res.json(transaction);
    },
    reducePrincipal: (req, res) => {
        const result = TransactionsService.reducePrincipalService(req.body);
        res.json(result);
    },
    finalsettlement: (req, res) => {
        const final = db.transaction((data) => {
            const amount = data.amount;
            const other_fees = data.other_fees || 0;
            const id_contract = data.id_contract;
            const id_staff = data.id_staff;
            const description = data.description;


            const contract = Contract.getById(id_contract);
            if (!contract) return { error: "Hợp đồng không tồn tại" };

            // Lấy tất cả kỳ chưa đóng của hợp đồng này (được sắp xếp theo period_number tăng dần)
            const schedules = PaymentSchedules.getByContractId(id_contract).filter(s => s.is_paid === 0).sort((a, b) => a.period_number - b.period_number);

            if (schedules.length === 0) {
                return { error: "Hợp đồng đã hoàn tất" };
            }
            // Tạo giao dịch loại 3 (tất toán)
            const transaction = Transactions.create({
                amount: amount,
                other_fees: other_fees,
                description: description,
                id_contract: id_contract,
                id_transaction_type: 3,
                id_staff: id_staff
            });

            // Cập nhật trạng thái của hợp đồng
            Contract.updateStatus({ status: 'Đã Tất Toán' }, id_contract);

            const collateral = Collaterals.getByContractId(contract.id);
            if (collateral) {
                collateral.forEach(item => {
                    Collaterals.updateStatus({ status: 'Đã Chuộc' }, item.id);
                })
            }

            // Cập nhật trạng thái của tất cả các kỳ
            schedules.forEach(schedule => {
                PaymentSchedules.updateStatus({ is_paid: 1 }, schedule.id);
            });

            const staff = Staff.getById(id_staff);

            AuditLogs.create({
                action: 'Tất toán Hợp đồng',
                details: `Tất toán Hợp đồng ${contract.code} với số tiền ${amount} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });

            return { transaction, msg: "Hợp đồng đã được tất toán" };
        });
        const result = final(req.body);
        if (result.error) {
            return res.status(400).json(result);
        }
        res.json(result);
    },
    liquidation: (req, res) => {
        const liquidation = db.transaction((data) => {
            const amount = data.amount;
            const id_contract = data.id_contract;
            const id_collateral = data.id_collateral;
            const id_staff = data.id_staff

            const contract = Contract.getById(id_contract);
            if (!contract) return { error: "Hợp đồng không tồn tại" };

            // Tạo giao dịch loại 5 (thanh lý)
            const transaction = Transactions.create({
                amount: amount,
                other_fees: 0,
                id_contract: id_contract,
                id_transaction_type: 5,
                id_staff: id_staff
            });

            // Cập nhật trạng thái của hợp đồng
            Contract.updateStatus({ status: 'Đã Thanh Lý' }, id_contract);

            // Cập nhật trạng thái của tài sản
            const collateral = Collaterals.getById(id_collateral);
            if (collateral) {
                Collaterals.updateStatus({ status: 'Đã Thanh Lý' }, collateral.id);
            } else {
                return { error: "Tài sản không tồn tại" };
            }

            const staff = Staff.getById(id_staff);

            AuditLogs.create({
                action: 'Thanh lý Tài Sản',
                details: `Thanh lý Tài Sản của Hợp đồng ${contract.code} với số tiền ${amount} bởi ${staff.name}`,
                id_staff: staff.id,
            });

            return { transaction, msg: "Tài sản đã được thanh lý" };
        });
        const result = liquidation(req.body);
        if (result.error) {
            return res.status(400).json(result);
        }
        res.json(result);
    },
    getReceiptToPrint: (req, res) => {
        const { id } = req.params;
        const { id_template } = req.query;
        const template = Template.getById(id_template);
        const transaction = Transactions.getReceiptToPrint(id);

        if (!transaction) {
            return res.status(404).json({ error: "Không tìm thấy dữ liệu giao dịch để in phiếu." });
        }

        const amount_text = doReadNumber(String(transaction.amount)) + " đồng";
        transaction.amount_text = amount_text.charAt(0).toUpperCase() + amount_text.slice(1);

        const other_fees_text = doReadNumber(String(transaction.other_fees)) + " đồng";
        transaction.other_fees_text = other_fees_text.charAt(0).toUpperCase() + other_fees_text.slice(1);

        const { buf, fileName } = generatePaymentReceiptDoc(transaction, template);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
            'Content-Length': buf.length
        });
        res.send(buf);
    }
}

module.exports = TransactionsController;