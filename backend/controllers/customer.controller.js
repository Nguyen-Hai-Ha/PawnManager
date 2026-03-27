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
            const data = { ...req.body };

            // Hiển thị dữ liệu nhận được để debug (tùy chọn)
            console.log('Backend received:', data);
            if (req.file) console.log('File received:', req.file);


            // Nếu có file upload từ multer
            if (req.file) {
                data.images_cccd = req.file.filename;
            }

            const customer = Customer.create(data);
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
