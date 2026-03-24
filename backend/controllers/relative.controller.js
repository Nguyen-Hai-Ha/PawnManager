const { Relative } = require('../models');

const RelativeController = {
    getByIdCustomer: (req, res) => {
        try {
            const relative = Relative.getByIdCustomer(req.params.id_customer);
            res.json(relative);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const relative = Relative.create(data);
            res.json(relative);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const data = req.body;
            const relative = Relative.update(req.params.id, data);
            res.json(relative);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const relative = Relative.delete(req.params.id);
            res.json(relative);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RelativeController;