const wellbeingRepository = require('./wellbeing.repository');

const createEntry = async (userId, entryData) => {
  return await wellbeingRepository.create({
    userId,
    ...entryData,
  });
};

const getEntries = async (userId, filters = {}) => {
  const { startDate, endDate } = filters;
  
  const where = { userId };
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  
  return await wellbeingRepository.findMany(where);
};

const getEntryByDate = async (userId, date) => {
  const entry = await wellbeingRepository.findByUserAndDate(userId, date);
  
  if (!entry) {
    const error = new Error('Wellbeing entry not found for this date');
    error.statusCode = 404;
    throw error;
  }
  
  return entry;
};

const updateEntry = async (userId, entryId, entryData) => {
  const entry = await wellbeingRepository.findById(entryId);
  
  if (!entry) {
    const error = new Error('Wellbeing entry not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (entry.userId !== userId) {
    const error = new Error('Unauthorized access to this entry');
    error.statusCode = 403;
    throw error;
  }
  
  return await wellbeingRepository.update(entryId, entryData);
};

const getStats = async (userId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const entries = await wellbeingRepository.findMany({
    userId,
    date: { gte: startDate },
  });
  
  if (entries.length === 0) {
    return {
      averageMood: 0,
      averageEnergy: 0,
      averageSleep: 0,
      totalEntries: 0,
      entries: [],
    };
  }
  
  const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
  const totalEnergy = entries.reduce((sum, entry) => sum + entry.energy, 0);
  const totalSleep = entries.reduce((sum, entry) => sum + entry.sleep, 0);
  
  return {
    averageMood: (totalMood / entries.length).toFixed(2),
    averageEnergy: (totalEnergy / entries.length).toFixed(2),
    averageSleep: (totalSleep / entries.length).toFixed(2),
    totalEntries: entries.length,
    entries,
  };
};

module.exports = {
  createEntry,
  getEntries,
  getEntryByDate,
  updateEntry,
  getStats,
};
