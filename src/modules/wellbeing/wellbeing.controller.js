const wellbeingService = require('./wellbeing.service');
const { successResponse } = require('../../utils/response.helper');

const createEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entryData = req.body;
    const entry = await wellbeingService.createEntry(userId, entryData);
    return successResponse(res, 'Wellbeing entry created successfully', entry, 201);
  } catch (error) {
    next(error);
  }
};

const getEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const entries = await wellbeingService.getEntries(userId, { startDate, endDate });
    return successResponse(res, 'Wellbeing entries retrieved successfully', entries);
  } catch (error) {
    next(error);
  }
};

const getEntryByDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;
    const entry = await wellbeingService.getEntryByDate(userId, new Date(date));
    return successResponse(res, 'Wellbeing entry retrieved successfully', entry);
  } catch (error) {
    next(error);
  }
};

const updateEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entryId = parseInt(req.params.id);
    const entryData = req.body;
    const entry = await wellbeingService.updateEntry(userId, entryId, entryData);
    return successResponse(res, 'Wellbeing entry updated successfully', entry);
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;
    const stats = await wellbeingService.getStats(userId, parseInt(days));
    return successResponse(res, 'Wellbeing stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntryByDate,
  updateEntry,
  getStats,
};
