const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, hasPermission('staff.read'), StaffController.getAll);
router.get('/:id', verifyToken, hasPermission('staff.detail'), StaffController.getById);
router.post('/', verifyToken, hasPermission('staff.create'), StaffController.create);
router.post('/login', StaffController.login);
router.put('/:id', verifyToken, hasPermission('staff.update'), StaffController.update);
router.delete('/:id', verifyToken, hasPermission('staff.delete'), StaffController.delete);

module.exports = router;