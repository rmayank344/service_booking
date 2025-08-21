const rateLimit = require('express-rate-limit');
require('dotenv').config();
const loginRateLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_MAX) || 5, 
 message: (req, res) => {
    return res.status(429).json({
      success: false,
      error: `Too many login attempts from this IP, please try again after ${
        (Number(process.env.LOGIN_RATE_WINDOW_MS) || 15 * 60 * 1000) / (60 * 1000)
      } minutes`
    });
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

module.exports = { loginRateLimiter };