const Joi = require('joi');

const createWellbeingSchema = Joi.object({
  date: Joi.date().iso().optional(),
  mood: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Mood must be a number',
    'number.min': 'Mood must be between 1 and 5',
    'number.max': 'Mood must be between 1 and 5',
    'any.required': 'Mood is required',
  }),
  energy: Joi.number().integer().min(0).max(5).required().messages({
    'number.base': 'Energy must be a number',
    'number.min': 'Energy must be between 0 and 5',
    'number.max': 'Energy must be between 0 and 5',
    'any.required': 'Energy is required',
  }),
  sleep: Joi.number().integer().min(0).max(5).required().messages({
    'number.base': 'Sleep must be a number',
    'number.min': 'Sleep must be between 0 and 5',
    'number.max': 'Sleep must be between 0 and 5',
    'any.required': 'Sleep is required',
  }),
  activities: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Activities must be an array',
    'any.required': 'Activities is required',
  }),
  note: Joi.string().optional().allow(null, ''),
});

const updateWellbeingSchema = Joi.object({
  mood: Joi.number().integer().min(1).max(5).optional(),
  energy: Joi.number().integer().min(0).max(5).optional(),
  sleep: Joi.number().integer().min(0).max(5).optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  note: Joi.string().optional().allow(null, ''),
});

module.exports = {
  createWellbeingSchema,
  updateWellbeingSchema,
};
