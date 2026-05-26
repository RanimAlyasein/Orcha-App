const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: { message: 'Too many requests. Try again later.', code: 'RATE_LIMITED' } },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
