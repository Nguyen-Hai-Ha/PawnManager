const express = require('express');
const router = express.Router();
const PaymentScheduleController = require('../controllers/payment_schudule.controller');

router.get('/', PaymentScheduleController.getAll);
router.get('/:id', PaymentScheduleController.getById);
// router.post('/', PaymentScheduleController.create);
router.put('/:id', PaymentScheduleController.update);
// router.delete('/:id', PaymentScheduleController.delete);
// router.delete('/contract/:id', PaymentScheduleController.deleteByContractId);

module.exports = router; 