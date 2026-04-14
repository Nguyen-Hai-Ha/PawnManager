const express = require('express');
const multer = require('multer');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const uploadFile = multer({ storage: multer.memoryStorage() });

router.get('/', verifyToken, hasPermission(['loans.read', 'pledge.read', 'repayment.read']), ContractController.getAll);
router.get('/type/:id', verifyToken, hasPermission(['loans.read', 'pledge.read', 'repayment.read']), ContractController.getByIdContractType);
router.get('/export', verifyToken, hasPermission(['loans.export', 'pledge.export', 'repayment.export']), ContractController.exportExcel);
router.post('/import', verifyToken, hasPermission(['loans.import', 'pledge.import', 'repayment.import']), uploadFile.single('file'), ContractController.importExcel);
router.get('/count-over-date', verifyToken, hasPermission(['loans.read', 'pledge.read', 'repayment.read']), ContractController.countContractOverDate);
router.get('/:id', verifyToken, hasPermission(['loans.detail', 'pledge.detail', 'repayment.detail']), ContractController.getById);
router.get('/:id/payment-details', verifyToken, hasPermission(['loans.detail', 'pledge.detail', 'repayment.detail']), ContractController.getPaymentDetails);
router.post('/', verifyToken, hasPermission(['loans.create', 'pledge.create', 'repayment.create']), upload.array('images', 10), ContractController.create);
router.delete('/:id', verifyToken, hasPermission('contract.delete'), ContractController.delete);
router.get('/:id/print', verifyToken, hasPermission(['loans.print', 'pledge.print', 'repayment.print']), ContractController.printReceipt);
router.get('/:id/settlement-detail', verifyToken, hasPermission(['loans.final_settlement', 'pledge.final_settlement', 'repayment.final_settlement']), ContractController.getSettlementDetail);
module.exports = router