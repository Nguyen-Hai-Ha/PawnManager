const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff.controller');

router.get('/', StaffController.getAll);
router.get('/:id', StaffController.getById);
router.post('/', StaffController.create);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);

module.exports = router;