const dashboardService = require('./dashboard.service');
const { successResponse } = require('../../utils/response.helper');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dashboard = await dashboardService.getDashboardData(userId);
    return successResponse(res, 'Dashboard data retrieved successfully', dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
