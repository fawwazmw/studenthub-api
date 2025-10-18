const profileService = require('./profile.service');
const { successResponse } = require('../../utils/response.helper');

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

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
};
