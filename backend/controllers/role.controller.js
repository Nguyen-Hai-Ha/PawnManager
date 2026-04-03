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
            const { id_role } = req.params;
            const permissions = RolePermission.getPermissionByRoleId(id_role);
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateRolePermissions: (req, res) => {
        try {
            const { id_role, permissionIds } = req.body;
            const result = RolePermission.updateRolePermissions(id_role, permissionIds);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RoleController;