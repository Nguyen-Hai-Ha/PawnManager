const { Customer, Relative, Contract, Staff, AuditLogs } = require('../models');

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
            const staff = Staff.getById(req.id_staff);
            const log = AuditLogs.create({
                action: 'Thêm mới khách hàng',
                details: `Thêm mới khách hàng ${customer.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
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

            const staff = Staff.getById(req.id_staff);
            const log = AuditLogs.create({
                action: 'Cập nhật thông tin khách hàng',
                details: `Cập nhật thông tin khách hàng ${customer.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
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

            const { id_staff } = req.query
            const staff = Staff.getById(id_staff);
            const log = AuditLogs.create({
                action: 'Xóa khách hàng',
                details: `Xóa khách hàng ${customer.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });

            Customer.delete(req.params.id);
            const relative = Relative.deleteByIdCustomer(req.params.id);
            res.json({customer, relative});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CustomerController;
