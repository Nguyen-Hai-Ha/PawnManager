const express = require('express');
const router = express.Router();
const CollateralTypeController = require('../controllers/collateral_type.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, CollateralTypeController.getAll);
router.get('/:id', verifyToken, hasPermission('collateral_type.read'), CollateralTypeController.getById);
router.post('/', verifyToken, hasPermission('collateral_type.create'), CollateralTypeController.create);
router.put('/:id', verifyToken, hasPermission('collateral_type.update'), CollateralTypeController.update);
router.delete('/:id', verifyToken, hasPermission('collateral_type.delete'), CollateralTypeController.delete);

module.exports = router;