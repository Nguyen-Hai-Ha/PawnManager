const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactions.controller');

router.get('/', TransactionsController.getAll);
router.get('/:id', TransactionsController.getById);
router.get('/contract/:id', TransactionsController.getByContractId);
router.get('/schedule/:id', TransactionsController.getByScheduleId);
router.get('/history/:id', TransactionsController.getHistoryPayment);
router.get('/history/reduce-principal/:id', TransactionsController.getHistoryReducePrincipal);
router.post('/', TransactionsController.create);
router.post('/reduce-principal', TransactionsController.reducePrincipal);
router.post('/final-settlement', TransactionsController.finalsettlement);
router.post('/liquidation', TransactionsController.liquidation);

router.delete('/:id', TransactionsController.delete);

module.exports = router;