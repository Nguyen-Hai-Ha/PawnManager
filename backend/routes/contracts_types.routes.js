const express = require('express');
const router = express.Router();
const ContractTypesController = require('../controllers/contracts_types.controller');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, ContractTypesController.getAll);
router.get('/:id', verifyToken, ContractTypesController.getById);
// router.post('/', verifyToken, hasPermission('contract_type.create'), ContractTypesController.create);

module.exports = router;