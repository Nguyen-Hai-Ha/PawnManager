const express = require('express');
const router = express.Router();
const TransactionTypeController = require('../controllers/transactions_type.controller');

router.get('/', TransactionTypeController.getAll);
router.post('/', TransactionTypeController.create);
router.delete('/:id', TransactionTypeController.delete);

module.exports = router;