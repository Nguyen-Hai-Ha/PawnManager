const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactions.controller');

router.get('/', TransactionsController.getAll);
router.get('/:id', TransactionsController.getById);
router.get('/contract/:id', TransactionsController.getByContractId);
router.post('/', TransactionsController.create);
router.delete('/:id', TransactionsController.delete);

module.exports = router;