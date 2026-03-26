const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', [verifyToken, hasPermission('customer.read')], CustomerController.getAll);
router.get('/:id', [verifyToken, hasPermission('customer.read')], CustomerController.getById);
router.post('/', [verifyToken, hasPermission('customer.create')], CustomerController.create);
router.put('/:id', [verifyToken, hasPermission('customer.update')], CustomerController.update);
router.delete('/:id', [verifyToken, hasPermission('customer.delete')], CustomerController.delete);

module.exports = router;