const { Transactions } = require('../models');

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
    create: (req, res) => {
        try {
            const data = req.body;
            const transaction = Transactions.create(data);
            res.json(transaction);
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
    }
}

module.exports = TransactionsController;