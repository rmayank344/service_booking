const express = require('express');
const router = new express.Router();
// middleware
const {validate_auth_token} = require("../middleware/authentication");
const validateRequest = require('../middleware/validate_request_schema');
const { loginRateLimiter } = require('../middleware/rateLimiter');

//utils
const signupSchema = require('../utils/schema_validation');

//contoller
const {user_signup, user_login, get_current_user} = require("../controller/auth_cntrll");

// signup routes
router.post('/signup', validateRequest(signupSchema), user_signup);
router.post('/login', validateRequest(signupSchema), loginRateLimiter, user_login);
router.get('/me', validate_auth_token, get_current_user);

module.exports = router;