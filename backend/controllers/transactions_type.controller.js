const { TransactionType }  = require('../models');

const TransactionTypeController = {
    getAll: (req, res) => {
        try {
            const transactionTypes = TransactionType.getAll();
            res.json(transactionTypes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const transactionType = TransactionType.create(data);
            res.json(transactionType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const transactionType = TransactionType.delete(req.params.id);
            res.json(transactionType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TransactionTypeController;