const { PaymentSchedules } = require('../models');

const PaymentScheduleController = {
    getAll: (req, res) => {
        try {
            const paymentSchedules = PaymentSchedules.getAll();
            res.json(paymentSchedules);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const paymentSchedule = PaymentSchedules.getById(req.params.id);
            res.json(paymentSchedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // create: (req, res) => {
    //     try {
    //         const data = req.body;
    //         const paymentSchedule = PaymentSchedules.create(data);
    //         res.json(paymentSchedule);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    update: (req, res) => {
        try {
            const data = req.body;
            const paymentSchedule = PaymentSchedules.update(req.params.id, data);
            res.json(paymentSchedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // delete: (req, res) => {
    //     try {
    //         const paymentSchedule = PaymentSchedules.delete(req.params.id);
    //         res.json(paymentSchedule);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    // deleteByContractId: (req, res) => {
    //     try {
    //         const paymentSchedules = PaymentSchedules.deleteByContractId(req.params.id);
    //         res.json(paymentSchedules);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
}

module.exports = PaymentScheduleController;