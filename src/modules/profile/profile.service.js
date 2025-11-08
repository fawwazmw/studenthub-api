const profileRepository = require('./profile.repository');

const getProfile = async (userId) => {
  const user = await profileRepository.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
};

const updateProfile = async (userId, profileData) => {
  const { name, avatarUrl } = profileData;
  
  const updateData = {};
  if (name) updateData.name = name;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
  
  const user = await profileRepository.update(userId, updateData);
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const updateSettings = async (userId, settings) => {
  const { theme, notificationsEnabled, language } = settings;
  
  const updateData = {};
  if (theme) updateData.theme = theme;
  if (notificationsEnabled !== undefined) updateData.notificationsEnabled = notificationsEnabled;
  if (language) updateData.language = language;
  
  const user = await profileRepository.update(userId, updateData);
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
};
