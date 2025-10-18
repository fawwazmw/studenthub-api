const express = require('express');
const router = express.Router();
const tasksController = require('./tasks.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { createTaskSchema, updateTaskSchema } = require('./tasks.validation');

// All routes are protected
router.use(authMiddleware);

router.post('/', validate(createTaskSchema), tasksController.createTask);
router.get('/', tasksController.getAllTasks);
router.get('/upcoming', tasksController.getUpcomingTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', validate(updateTaskSchema), tasksController.updateTask);
router.patch('/:id/toggle', tasksController.toggleTaskStatus);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
