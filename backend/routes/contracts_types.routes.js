const express = require('express');
const router = express.Router();
const ContractTypesController = require('../controllers/contracts_types.controller');

router.get('/', ContractTypesController.getAll);
router.get('/:id', ContractTypesController.getById);
router.post('/', ContractTypesController.create);

module.exports = router;