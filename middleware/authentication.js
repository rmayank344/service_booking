const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth_configs = require("../config/auth_config.json");
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// Validate Auth Token
const validate_auth_token = async (req, res, next) => {
  const LOGIN_URL = `${process.env.SERVICE_HOST}/api/user/${process.env.SERVICE_VERSION}/auth-route/login`;
  try {
    const api_key = req.header('x-api-key');
    if (!api_key) {
      return response_handler.send_error_response(
        res, "Api key is missing", 400
      );
    }

    const auth_token = req.header('x-auth-token');
    if (!auth_token) {
      return response_handler.send_error_response(
        res, "Auth Token is missing", 400
      );
    }
    try {
      const verified_auth_token = jwt.verify(auth_token, auth_configs[api_key].secret_key_auth);
      req.id = verified_auth_token.id;
        req.email = verified_auth_token.email;
        req.role = verified_auth_token.role;
    }
    catch (err) {
      if (err.name === "TokenExpiredError") {
        return response_handler.send_error_response(
          res,
          "Auth token has expired. Please login again.",
          401,
          { user_login_url: LOGIN_URL }
        );
      }
      return response_handler.send_error_response(
        res, 'Unauthorised auth token', 401
      )
    }
    next();
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

// verified admin role
const admin_access = async (req, res, next) => {
  try {
    if (req.role === 'customer' || req.role === 'pro') {
      return response_handler.send_error_response(
        res, "Only Admin can access this page.", 400
      )
    }
    next();
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

// verified pro role
const pro_access = async (req, res, next) => {
  try {
    if (req.role === 'customer' || req.role === 'admin') {
      return response_handler.send_error_response(
        res, "Only pro can access this page.", 400
      )
    }
    next();
  }
  catch (err) {
    return handleCaughtError(err, res);
  }
};

module.exports = { validate_auth_token, admin_access, pro_access };