const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { upload } = require('../../utils/upload.helper');

// All routes are protected
router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/settings', profileController.updateSettings);
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);

module.exports = router;
