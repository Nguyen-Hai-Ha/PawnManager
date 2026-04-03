const express = require('express');
const router = express.Router();
const CollateralsController = require('../controllers/collaterals.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, hasPermission('collateral.read'), CollateralsController.getAll);
router.get('/:id', verifyToken, hasPermission('collateral.detail'), CollateralsController.getById);
router.get('/liquidation/:id', verifyToken, hasPermission('collateral.liquidation'), CollateralsController.getLiquidationById);
router.post('/', verifyToken, hasPermission('collateral.create'), CollateralsController.create);
router.put('/:id', verifyToken, hasPermission('collateral.update'), CollateralsController.update);
// router.delete('/:id', CollateralsController.delete);

module.exports = router;