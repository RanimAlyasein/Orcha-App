const { sendError } = require('../utils/response');

const validate = (rules) => (req, res, next) => {
  for (const [field, checks] of Object.entries(rules)) {
    const value = req.body[field];
    const empty = value === undefined || value === null || value === '';
    if (checks.required && empty) return sendError(res, `${field} is required.`, 422, 'VALIDATION_ERROR');
    if (!empty) {
      if (checks.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return sendError(res, `${field} must be a valid email.`, 422, 'VALIDATION_ERROR');
      if (checks.minLength && String(value).length < checks.minLength)
        return sendError(res, `${field} must be at least ${checks.minLength} characters.`, 422, 'VALIDATION_ERROR');
      if (checks.maxLength && String(value).length > checks.maxLength)
        return sendError(res, `${field} must not exceed ${checks.maxLength} characters.`, 422, 'VALIDATION_ERROR');
    }
  }
  next();
};

module.exports = { validate };
