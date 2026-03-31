const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', verifyToken, hasPermission('contract.read'), ContractController.getAll);
router.get('/type/:id', verifyToken, hasPermission('contract.read'), ContractController.getByIdContractType);
router.get('/:id', verifyToken, hasPermission('contract.read'), ContractController.getById);
router.get('/:id/payment-details', verifyToken, hasPermission('contract.detail'), ContractController.getPaymentDetails);
router.post('/', verifyToken, hasPermission('contract.create'), upload.array('images', 10), ContractController.create);
router.delete('/:id', verifyToken, hasPermission('contract.delete'), ContractController.delete);
router.get('/:id/print', verifyToken, hasPermission('contract.print'), ContractController.print);
module.exports = router