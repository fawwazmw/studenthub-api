const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 200 characters',
  }),
  description: Joi.string().optional().allow(null, ''),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.base': 'Due date must be a valid date',
    'any.required': 'Due date is required',
  }),
  isDone: Joi.boolean().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().optional().allow(null, ''),
  category: Joi.string().optional(),
  dueDate: Joi.date().iso().optional(),
  isDone: Joi.boolean().optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
