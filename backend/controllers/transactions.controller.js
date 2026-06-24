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
        const result = TransactionsService.finalsettlementContract(req.body);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json(result);
    },
    liquidation: (req, res) => {
        const result = TransactionsService.liquidationContract(req.body);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json(result);
    },
    getReceiptToPrint: (req, res) => {
        const { id } = req.params;
        const { id_template } = req.query;
        const { buf, fileName } = TransactionsService.receiptToPrint(id, id_template);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(result.fileName)}"`,
            'Content-Length': result.buf.length
        });
        res.send(result.buf);
    }
}

module.exports = TransactionsController;