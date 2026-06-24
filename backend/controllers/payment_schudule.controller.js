const { PaymentSchedules } = require('../models');

const PaymentScheduleController = {
    getAll: (req, res) => {
        const paymentSchedules = PaymentSchedules.getAll();
        res.json(paymentSchedules);
    },
    getById: (req, res) => {
        const paymentSchedule = PaymentSchedules.getById(req.params.id);
        res.json(paymentSchedule);
    },
}

module.exports = PaymentScheduleController;