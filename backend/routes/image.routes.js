const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/image.controller');

const upload = require('../middlewares/upload.middleware');

router.post('/', upload.single('image'), ImageController.create);
router.put('/:id', upload.single('image'), ImageController.update);
router.delete('/:id', ImageController.delete);

module.exports = router;