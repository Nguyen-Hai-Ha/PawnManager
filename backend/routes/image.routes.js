const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/image.controller');

router.delete('/:id', ImageController.delete);

module.exports = router;