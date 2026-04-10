const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/settings.controller');
const { getSettings, updateSettings } = require('../services/mail/SettingsService');
const { verifyToken, hasPermission } = require('../middlewares/auth.middleware');
const uploadFile = require('../middlewares/uploadFile.middleware');   

router.get('/', verifyToken, hasPermission('settings.view'), getSettings);
router.get('/templates', verifyToken, hasPermission('settings.template_view'), SettingController.getAllTemplates);
router.get('/templates/:id', verifyToken, hasPermission('settings.template_detail'), SettingController.getTemplateById);
router.post('/templates', verifyToken, hasPermission('settings.template_create'), uploadFile.single('file_path'), SettingController.createTemplates);
router.put('/templates/:id', verifyToken, hasPermission('settings.template_update'), uploadFile.single('file_path'), SettingController.updateTemplate);
router.delete('/templates/:id', verifyToken, hasPermission('settings.template_delete'), SettingController.deleteTemplate);
router.put('/', verifyToken, hasPermission('settings.update'), updateSettings);
router.get('/templates/:id/download', verifyToken, hasPermission('settings.template_download'), SettingController.downLoadTemplate);

module.exports = router;