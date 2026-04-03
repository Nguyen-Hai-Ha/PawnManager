const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactions.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, hasPermission('transaction.read'), TransactionsController.getAll);
router.get('/:id', verifyToken, hasPermission('transaction.detail'), TransactionsController.getById);
router.get('/contract/:id', verifyToken, TransactionsController.getByContractId);
router.get('/schedule/:id', verifyToken, hasPermission(['loans.interest_payment', 'pledge.interest_payment', 'repayment.interest_payment']), TransactionsController.getByScheduleId);
router.get('/history/:id', verifyToken, hasPermission('transaction.detail'), TransactionsController.getHistoryPayment);
router.get('/history/reduce-principal/:id', verifyToken, hasPermission(['loans.reduce_principal', 'pledge.reduce_principal', 'repayment.reduce_principal']), TransactionsController.getHistoryReducePrincipal);
router.post('/', verifyToken, TransactionsController.create);
router.post('/reduce-principal', verifyToken, hasPermission(['loans.reduce_principal', 'pledge.reduce_principal', 'repayment.reduce_principal']), TransactionsController.reducePrincipal);
router.post('/final-settlement', verifyToken, hasPermission(['loans.final_settlement', 'pledge.final_settlement', 'repayment.final_settlement']), TransactionsController.finalsettlement);
router.post('/liquidation', verifyToken, hasPermission('collateral.liquidation'), TransactionsController.liquidation);

router.delete('/:id', verifyToken, hasPermission('transaction.delete'), TransactionsController.delete);

module.exports = router;