const { Role } = require('../models');

const RoleController = {
    getAll: (req, res) => {
        try {
            const roles = Role.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const role = Role.create(data);
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const role = Role.delete(req.params.id);
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;