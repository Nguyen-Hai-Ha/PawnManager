const { Role } = require('../models');

const RoleController = {
    getAll: (req, res) => {
        try {
            const roles = Role.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;