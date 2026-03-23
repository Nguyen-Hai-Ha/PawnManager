const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/contract.controller');

router.get('/', ContractController.getAll);
router.get('/:id', ContractController.getById);
router.post('/', ContractController.create);
router.delete('/:id', ContractController.delete);
module.exports = router;