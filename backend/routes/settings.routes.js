const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/settings.controller');
const { getSettings, updateSettings } = require('../services/mail/SettingsService');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');
const uploadFile = require('../middlewares/uploadFile.middleware');   

router.get('/', verifyToken, hasPermission('settings.view'), getSettings);
router.get('/templates', verifyToken, hasPermission('settings.view'), SettingController.getAllTemplates);
router.get('/templates/:id', verifyToken, hasPermission('settings.view'), SettingController.getTemplateById);
router.post('/templates', verifyToken, hasPermission('settings.create'), uploadFile.single('file_path'), SettingController.createTemplates);
router.put('/templates/:id', verifyToken, hasPermission('settings.update'), uploadFile.single('file_path'), SettingController.updateTemplate);
router.delete('/templates/:id', verifyToken, hasPermission('settings.delete'), SettingController.deleteTemplate);
router.put('/', verifyToken, hasPermission('settings.update'), updateSettings);

module.exports = router;