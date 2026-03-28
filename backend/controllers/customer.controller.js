const { Customer, Relative, Contract } = require('../models');

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
            const data = { ...req.body };

            if (req.file) {
                data.images_cccd = req.file.filename;
            }

            const customer = Customer.create(data);
            if (data.relatives && data.relatives.length > 0) {
                const relatives = JSON.parse(data.relatives);
                relatives.forEach(item => {
                    Relative.create({ ...item, id_customer: customer.id });
                });
            }
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const data = { ...req.body };

            if (req.file) {
                data.images_cccd = req.file.filename;
            }

            const customer = Customer.update(req.params.id, data);
            const relatives = JSON.parse(data.relatives);
            if (data.relatives && data.relatives.length > 0) {
                const oldRelatives = Relative.getByIdCustomer(req.params.id);
                const oldIds = oldRelatives.map(item => item.id)
                const newIds = relatives.map(item => item.id)
                
                const idsToDelete = oldIds.filter(id => !newIds.includes(id));

                if (idsToDelete) {
                    idsToDelete.forEach(id => {
                        Relative.delete(id);
                    });
                }

                relatives.forEach(item => {
                    if (item.id) {
                        Relative.update(item.id, {...item, id_customer: req.params.id});
                    } else {
                        Relative.create({ ...item, id_customer: req.params.id });
                    }
                });
                
            }
            res.json({customer, relatives});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const customer = Customer.getById(req.params.id);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            const contract = Contract.getByIdCustomer(req.params.id);
            if (contract) {
                return res.status(400).json({ error: 'Customer has contract' });
            }
            Customer.delete(req.params.id);
            const relative = Relative.deleteByIdCustomer(req.params.id);
            res.json({customer, relative});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CustomerController;
