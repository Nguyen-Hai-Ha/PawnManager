const multer = require('multer');
const path = require('path');
const pathHelper = require('../config/pathHelper');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathHelper.getPath('images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
