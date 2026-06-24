const { TransactionType }  = require('../models');

const TransactionTypeController = {
    getAll: (req, res) => {
        const transactionTypes = TransactionType.getAll();
        res.json(transactionTypes);
    },
    create: (req, res) => {
        const data = req.body;
        const transactionType = TransactionType.create(data);
        res.json(transactionType);
    },
    delete: (req, res) => {
        const transactionType = TransactionType.delete(req.params.id);
        res.json(transactionType);
    }
}

module.exports = TransactionTypeController;