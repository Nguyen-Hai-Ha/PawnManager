const { Staff } = require('../models');

const StaffController = {
    getAll: (req, res) => {
        try {
            const staffs = Staff.getAll();
            res.json(staffs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const staff = Staff.getById(req.params.id);
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const staff = Staff.create(data);
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const data = req.body;
            const staff = Staff.update(req.params.id, data);
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const staff = Staff.delete(req.params.id);
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = StaffController;