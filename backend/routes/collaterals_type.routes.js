const express = require('express');
const router = express.Router();
const CollateralTypeController = require('../controllers/collateral_type.controller');

router.get('/', CollateralTypeController.getAll);
router.get('/:id', CollateralTypeController.getById);
router.post('/', CollateralTypeController.create);
router.put('/:id', CollateralTypeController.update);
router.delete('/:id', CollateralTypeController.delete);

module.exports = router;