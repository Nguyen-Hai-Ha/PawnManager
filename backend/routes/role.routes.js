const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');

router.get('/', RoleController.getAll);
router.post('/', RoleController.create);
router.delete('/:id', RoleController.delete);

module.exports = router;