const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');
const { verifyToken, verifyPermission } = require('../middlewares/auth');

router.get('/', verifyToken, verifyPermission('contract.read'), ContractController.getAll);
router.get('/:id', verifyToken, verifyPermission('contract.read'), ContractController.getById);
router.get('/:id/payment-details', verifyToken, verifyPermission('contract.detail'), ContractController.getPaymentDetails);
router.post('/', verifyToken, verifyPermission('contract.create'), ContractController.create);
router.delete('/:id', verifyToken, verifyPermission('contract.delete'), ContractController.delete);
router.get('/:id/print', verifyToken, verifyPermission('contract.print'), ContractController.print);
module.exports = router;