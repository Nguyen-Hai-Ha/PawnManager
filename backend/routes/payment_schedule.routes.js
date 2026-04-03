const express = require('express');
const router = express.Router();
const PaymentScheduleController = require('../controllers/payment_schudule.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, PaymentScheduleController.getAll);
router.get('/:id', verifyToken, PaymentScheduleController.getById);
// router.post('/', verifyToken, hasPermission('payment_schedule.create'), PaymentScheduleController.create);
router.put('/:id', verifyToken, PaymentScheduleController.update);
// router.delete('/:id', verifyToken, hasPermission('payment_schedule.delete'), PaymentScheduleController.delete);
// router.delete('/contract/:id', PaymentScheduleController.deleteByContractId);

module.exports = router; 