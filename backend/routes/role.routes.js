const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, RoleController.getAll);

module.exports = router;