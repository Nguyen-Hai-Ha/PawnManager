const multer = require('multer');
const path = require('path');

const { templatesDir } = require('../config/paths');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, templatesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const saveName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, uniqueSuffix + '-' + saveName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;