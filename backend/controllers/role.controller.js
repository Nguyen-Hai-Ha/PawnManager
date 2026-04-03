const { Role, RolePermission } = require('../models');

const RoleController = {
    getAll: (req, res) => {
        try {
            const roles = Role.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPermissionByRoleId: (req, res) => {
        try {
            const { id } = req.params;
            const permissions = RolePermission.getPermissionByRoleId(id);
            if (!permissions) {
                return res.status(403).json({ error: 'Permissions of role not found' });
            }
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateRolePermissions: (req, res) => {
        try {
            const { id } = req.params;
            const { permissionIds } = req.body;
            const result = RolePermission.updateRolePermissions(id, permissionIds);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;