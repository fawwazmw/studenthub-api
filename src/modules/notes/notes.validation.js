const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 200 characters',
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
  }),
  category: Joi.string().valid('study', 'personal', 'reminder', 'project').required().messages({
    'any.only': 'Category must be one of: study, personal, reminder, project',
    'string.empty': 'Category is required',
  }),
  fileUrl: Joi.string().uri().optional().allow(null, ''),
  isHandwriting: Joi.boolean().optional(),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  content: Joi.string().optional(),
  category: Joi.string().valid('study', 'personal', 'reminder', 'project').optional(),
  fileUrl: Joi.string().uri().optional().allow(null, ''),
  isHandwriting: Joi.boolean().optional(),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
};
