const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');

router.get('/', ContractController.getAll);
router.get('/:id', ContractController.getById);
router.get('/:id/payment-details', ContractController.getPaymentDetails);
router.post('/', ContractController.create);
router.delete('/:id', ContractController.delete);
router.get('/:id/print', ContractController.print);
module.exports = router;