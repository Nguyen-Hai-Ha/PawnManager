const express = require('express');
const router = express.Router();
const RelativeController = require('../controllers/relative.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/:id_customer', verifyToken, RelativeController.getByIdCustomer);
router.post('/', verifyToken, RelativeController.create);
router.put('/:id', verifyToken, RelativeController.update);
router.delete('/:id', verifyToken, RelativeController.delete);

module.exports = router;