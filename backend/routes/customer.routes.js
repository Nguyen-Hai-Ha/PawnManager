const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', [verifyToken, hasPermission('customer.read')], CustomerController.getAll);
router.get('/:id', [verifyToken, hasPermission('customer.detail')], CustomerController.getById);
router.post('/', [verifyToken, hasPermission('customer.create'), upload.fields([{ name: 'images_cccd', maxCount: 1 }, { name: 'images_cccd_back', maxCount: 1 }])], CustomerController.create);
router.put('/:id', [verifyToken, hasPermission('customer.update'), upload.fields([{ name: 'images_cccd', maxCount: 1 }, { name: 'images_cccd_back', maxCount: 1 }])], CustomerController.update);
router.delete('/:id', [verifyToken, hasPermission('customer.delete')], CustomerController.delete);

module.exports = router;