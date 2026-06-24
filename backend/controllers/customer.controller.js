const { Customer, Relative, Contract, Staff, AuditLogs } = require('../models');

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

        if (req.files) {
            if (req.files['images_cccd']) {
                data.images_cccd = req.files['images_cccd'][0].filename;
            }
            if (req.files['images_cccd_back']) {
                data.images_cccd_back = req.files['images_cccd_back'][0].filename;
            }
        }

        const customer = Customer.create(data);
        const staff = Staff.getById(req.userId || data.id_staff);
        if (staff && data.name) {
            AuditLogs.create({
                action: 'Thêm mới khách hàng',
                details: `Thêm mới khách hàng ${data.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
        }
        if (data.relatives && typeof data.relatives === 'string' && data.relatives.length > 0) {
            try {
                const relativesArray = JSON.parse(data.relatives);
                if (Array.isArray(relativesArray)) {
                    relativesArray.forEach(item => {
                        if (item) Relative.create({ ...item, id_customer: customer.id });
                    });
                }
            } catch (e) {
                console.error('Error parsing relatives:', e);
            }
        }
        res.json(customer);
    },
    update: (req, res) => {
        const data = { ...req.body };

        if (req.files) {
            if (req.files['images_cccd']) {
                data.images_cccd = req.files['images_cccd'][0].filename;
            }
            if (req.files['images_cccd_back']) {
                data.images_cccd_back = req.files['images_cccd_back'][0].filename;
            }
        }

        const customer = Customer.update(req.params.id, data);
        const relatives = [];
        if (data.relatives && typeof data.relatives === 'string' && data.relatives.length > 0) {
            try {
                const parsedRelatives = JSON.parse(data.relatives);
                if (Array.isArray(parsedRelatives)) {
                    const oldRelatives = Relative.getByIdCustomer(req.params.id);
                    const oldIds = oldRelatives.map(item => item.id);
                    const newIds = parsedRelatives.map(item => item.id).filter(id => id);
                    
                    const idsToDelete = oldIds.filter(id => !newIds.includes(id));

                    idsToDelete.forEach(id => {
                        Relative.delete(id);
                    });

                    parsedRelatives.forEach(item => {
                        if (item.id) {
                            Relative.update(item.id, {...item, id_customer: req.params.id});
                        } else {
                            Relative.create({ ...item, id_customer: req.params.id });
                        }
                        relatives.push(item);
                    });
                }
            } catch (e) {
                console.error('Error parsing relatives in update:', e);
            }
        }

        const staff = Staff.getById(req.userId || data.id_staff);
        if (staff && data.name) {
            AuditLogs.create({
                action: 'Cập nhật thông tin khách hàng',
                details: `Cập nhật thông tin khách hàng ${data.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
        }
        res.json({customer, relatives});
    },
    delete: (req, res) => {
        const customer = Customer.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const contract = Contract.getByIdCustomer(req.params.id);
        if (contract && contract.length > 0) {
            return res.status(400).json({ error: 'Customer has contract' });
        }

        const staff = Staff.getById(req.userId || req.query.id_staff);
        if (staff && customer && customer.name) {
            AuditLogs.create({
                action: 'Xóa khách hàng',
                details: `Xóa khách hàng ${customer.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
        }

        Customer.delete(req.params.id);
        const relative = Relative.deleteByIdCustomer(req.params.id);
        res.json({customer, relative});
    }
};

module.exports = CustomerController;
