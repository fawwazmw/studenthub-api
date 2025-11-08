const tasksService = require('./tasks.service');
const { successResponse } = require('../../utils/response.helper');

const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskData = req.body;
    const task = await tasksService.createTask(userId, taskData);
    return successResponse(res, 'Task created successfully', task, 201);
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, isDone, sortBy } = req.query;
    const tasks = await tasksService.getAllTasks(userId, { category, isDone, sortBy });
    return successResponse(res, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const task = await tasksService.getTaskById(userId, taskId);
    return successResponse(res, 'Task retrieved successfully', task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const taskData = req.body;
    const task = await tasksService.updateTask(userId, taskId, taskData);
    return successResponse(res, 'Task updated successfully', task);
  } catch (error) {
    next(error);
  }
};

const toggleTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const task = await tasksService.toggleTaskStatus(userId, taskId);
    return successResponse(res, 'Task status updated successfully', task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    await tasksService.deleteTask(userId, taskId);
    return successResponse(res, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getUpcomingTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;
    const tasks = await tasksService.getUpcomingTasks(userId, parseInt(limit));
    return successResponse(res, 'Upcoming tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getUpcomingTasks,
};
