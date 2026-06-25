const { Customer, Relative, Contract, Staff, AuditLogs } = require('../models');
const CustomerService = require('../services/customer.service');

const CustomerController = {
    getAll: (req, res) => {
        const customers = Customer.getAll();
        res.json(customers);
    },
    getById: (req, res) => {
        const customer = Customer.getById(req.params.id);
        res.json(customer);
    },
    create: (req, res) => {
        const data = { ...req.body };
        const customer = CustomerService.createCustomer(data, req.files, req.userId);
        res.json(customer);
    },
    update: (req, res) => {
        const data = { ...req.body };
        const { customer, relatives } = CustomerService.updateCustomer(data, req.files, req.userId);
        res.json({customer, relatives});
    },
    delete: (req, res) => {
        const result = CustomerService.deleteCustomer(req.params.id, (req.userId || req.query.id_staff));
        res.json(result);
    }
};

module.exports = CustomerController;
