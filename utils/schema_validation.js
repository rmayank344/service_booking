const Joi = require('joi');
// Joi schema for validation
const signupSchema = Joi.object({
  email: Joi.string().email().max(30).required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().max(30).optional(),
  country_code: Joi.string().max(5).optional(),
  phone: Joi.string().max(10).optional()
});

module.exports = signupSchema;