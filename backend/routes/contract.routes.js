const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, hasPermission('contract.read'), ContractController.getAll);
router.get('/:id', verifyToken, hasPermission('contract.read'), ContractController.getById);
router.get('/:id/payment-details', verifyToken, hasPermission('contract.detail'), ContractController.getPaymentDetails);
router.post('/', verifyToken, hasPermission('contract.create'), ContractController.create);
router.delete('/:id', verifyToken, hasPermission('contract.delete'), ContractController.delete);
router.get('/:id/print', verifyToken, hasPermission('contract.print'), ContractController.print);
module.exports = router;