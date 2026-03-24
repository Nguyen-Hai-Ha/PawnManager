const express = require('express');
const router = express.Router();
const RelativeController = require('../controllers/relative.controller');

router.get('/:id_customer', RelativeController.getByIdCustomer);
router.post('/', RelativeController.create);
router.put('/:id', RelativeController.update);
router.delete('/:id', RelativeController.delete);

module.exports = router;