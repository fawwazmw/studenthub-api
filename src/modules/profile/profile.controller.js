const profileService = require('./profile.service');
const { successResponse } = require('../../utils/response.helper');
const { deleteFile } = require('../../utils/upload.helper');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await profileService.getProfile(userId);
    return successResponse(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    const profile = await profileService.updateProfile(userId, profileData);
    return successResponse(res, 'Profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settings = req.body;
    const profile = await profileService.updateSettings(userId, settings);
    return successResponse(res, 'Settings updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Generate URL for the uploaded file
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    // Get current profile to delete old avatar
    const currentProfile = await profileService.getProfile(userId);
    
    // Update profile with new avatar URL
    const profile = await profileService.updateProfile(userId, { avatarUrl });
    
    // Delete old avatar file if exists
    if (currentProfile.avatarUrl && currentProfile.avatarUrl !== avatarUrl) {
      await deleteFile(currentProfile.avatarUrl);
    }
    
    return successResponse(res, 'Avatar uploaded successfully', profile);
  } catch (error) {
    // If error occurs, delete the uploaded file
    if (req.file) {
      await deleteFile(`/uploads/avatars/${req.file.filename}`);
    }
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
  uploadAvatar,
};
