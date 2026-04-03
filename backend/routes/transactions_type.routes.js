const express = require('express');
const router = express.Router();
const TransactionTypeController = require('../controllers/transactions_type.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, TransactionTypeController.getAll);
router.post('/', verifyToken, TransactionTypeController.create);
router.delete('/:id', verifyToken, TransactionTypeController.delete);

module.exports = router;