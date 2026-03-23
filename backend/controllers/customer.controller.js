const { Customer } = require('../models');

const CustomerController = {
    getAll: (req, res) => {
        try {
            const customers = Customer.getAll();
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const customer = Customer.getById(req.params.id);
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const customer = Customer.create(req.body);
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const customer = Customer.update(req.params.id, req.body);
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const customer = Customer.delete(req.params.id);
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CustomerController;
