const tasksRepository = require('./tasks.repository');

const createTask = async (userId, taskData) => {
  return await tasksRepository.create({
    userId,
    ...taskData,
  });
};

const getAllTasks = async (userId, filters = {}) => {
  const { category, isDone, sortBy } = filters;
  
  const where = { userId };
  
  if (category) {
    where.category = category;
  }
  
  if (isDone !== undefined) {
    where.isDone = isDone === 'true' || isDone === true;
  }
  
  let orderBy = { dueDate: 'asc' };
  if (sortBy === 'created') {
    orderBy = { createdAt: 'desc' };
  } else if (sortBy === 'title') {
    orderBy = { title: 'asc' };
  }
  
  return await tasksRepository.findMany(where, orderBy);
};

const getTaskById = async (userId, taskId) => {
  const task = await tasksRepository.findById(taskId);
  
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (task.userId !== userId) {
    const error = new Error('Unauthorized access to this task');
    error.statusCode = 403;
    throw error;
  }
  
  return task;
};

const updateTask = async (userId, taskId, taskData) => {
  await getTaskById(userId, taskId); // Check ownership
  
  return await tasksRepository.update(taskId, taskData);
};

const toggleTaskStatus = async (userId, taskId) => {
  const task = await getTaskById(userId, taskId); // Check ownership
  
  return await tasksRepository.update(taskId, {
    isDone: !task.isDone,
  });
};

const deleteTask = async (userId, taskId) => {
  await getTaskById(userId, taskId); // Check ownership
  
  return await tasksRepository.delete(taskId);
};

const getUpcomingTasks = async (userId, limit = 5) => {
  return await tasksRepository.findUpcoming(userId, limit);
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
