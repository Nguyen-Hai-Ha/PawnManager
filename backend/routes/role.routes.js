const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, RoleController.getAll);
router.get('/permission-role/:id', verifyToken, hasPermission('role_permission.read'), RoleController.getPermissionByRoleId);
router.put('/permission-role/:id', verifyToken, hasPermission('role_permission.update'), RoleController.updateRolePermissions);

module.exports = router;