const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../services/mail/SettingsService');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, hasPermission('settings.view'), getSettings);
router.put('/', verifyToken, hasPermission('settings.update'), updateSettings);

module.exports = router;