const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/image.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', verifyToken, upload.single('image'), ImageController.create);
router.put('/:id', verifyToken, upload.single('image'), ImageController.update);
router.delete('/:id', verifyToken, ImageController.delete);

module.exports = router;