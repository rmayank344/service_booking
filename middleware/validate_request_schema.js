const response_handler = require('../utils/response_handler');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      const message = error.details[0].message.replace(/["]/g, '');
      return response_handler.send_error_response(res, message, 400);
    }
    req.body = value;
    next();
  };
};

module.exports = validateRequest;