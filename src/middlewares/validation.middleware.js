const { errorResponse } = require('../utils/response.helper');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return errorResponse(res, 'Validation failed', 400, errors);
    }

    next();
  };
};

module.exports = validate;
