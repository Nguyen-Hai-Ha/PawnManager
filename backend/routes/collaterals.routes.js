const express = require('express');
const router = express.Router();
const CollateralsController = require('../controllers/collaterals.controller');

router.get('/', CollateralsController.getAll);
router.get('/:id', CollateralsController.getById);
router.get('/liquidation/:id', CollateralsController.getLiquidationById);
router.post('/', CollateralsController.create);
router.put('/:id', CollateralsController.update);
router.delete('/:id', CollateralsController.delete);

module.exports = router;