const jwt = require('jsonwebtoken');
const auth_config = require("../config/auth_config.json");

// Import Model
const USERMODEL = require("../models/user_model");

// Import Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");
const { password_hashed } = require("../utils/password_verified");
const { comparePassword } = require("../utils/password_verified");



/** User signup Api
 * 
 * ENDPOINT : /api/user/v1/auth-route/signup
 * Table used : user_model
 * 
 */

const user_signup = async (req, res) => {
  try {

    // --- Request logging ---
    console.log(`[SIGNUP REQUEST] ${new Date().toISOString()} - Body:`, req.body);

    const { email, password, name, country_code, phone } = req.body;
    const api_key = req.header('x-api-key');
    if (!api_key) {
      return response_handler.send_error_response(
        res, "Api key is missing", 400
      )
    }
    const authConfig = auth_config[api_key];
    if (!authConfig) {
      return response_handler.send_error_response(res, "Invalid API key", 400);
    }

    const check_email = await USERMODEL.findOne({ where: { email }, attributes: ['email'], raw: true });
    if (check_email) return response_handler.send_error_response(res, "Email already exits.", 400);
    const hashedPassword = await password_hashed(password);
    const create_user = await USERMODEL.create({
      email: email,
      password: hashedPassword,
      name: name,
      country_code: country_code,
      phone: phone,
      role: authConfig.role,
    });

    const { password: _, ...safeUser } = create_user.toJSON();

    return response_handler.send_success_response(
      res, { message: "user signup successfully.", user: safeUser }, 201
    )
  }
  catch (err) {
    console.error(`[SIGNUP ERROR]:`, err);
    return handleCaughtError(err, res);
  }
};

/** User login Api
 * 
 * ENDPOINT : /api/user/v1/auth-route/login
 * Table used : user_model
 * 
 */

const user_login = async (req, res) => {
  try {
    console.log(`[LOGIN REQUEST] ${new Date().toISOString()} - Body:`, req.body);
    const api_key = req.header('x-api-key');
    if (!api_key) {
      return response_handler.send_error_response(
        res, "Api key is missing", 400
      );
    }
    const { email, password } = req.body;
    const user = await USERMODEL.findOne({ where: { email }, attributes: ['user_id','email', 'password','role'], raw: true });
    if (!user) {
      const SIGNUP_URL = `${process.env.SERVICE_HOST}/api/user/${process.env.SERVICE_VERSION}/auth-route/signup`;
      return response_handler.send_error_response(
        res,
        "User not found. Please signup.",
        400,
        { signup_url: SIGNUP_URL }
      );
    }
    const authConfig = auth_config[api_key];
    if (!authConfig) return response_handler.send_error_response(res, "Invalid API key", 400);
    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) return response_handler.send_error_response(res, "Login credentials wrong.", 400);
    else {
      let token_payload = null;
      let auth_token = null;
      token_payload = {
        id: user.user_id,
        email: user.email,
        role: user.role,
      };
      auth_token = jwt.sign(token_payload, authConfig.secret_key_auth, { expiresIn: process.env.ACCESS_AUTH_TOKEN_EXPIRES_IN });
      return response_handler.send_success_response(
        res, { message: "user loggin successfully.", "user": token_payload, "auth_token": auth_token }, 200
      );
    }
  }
  catch (err) {
    console.error(`[LOGIN ERROR]:`, err);
    return handleCaughtError(err, res);
  }
};

/** User profile get Api
 * 
 * ENDPOINT : /api/user/v1/auth-route/me
 * Table used : user_model
 * 
 */

const get_current_user = async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(`[GET CURRENT USER] ${new Date().toISOString()} - UserID: ${userId}`);

    const user = await USERMODEL.findOne({where: { user_id: userId },raw: true});
    const { password, ...safeUser } = user;

    if (!user) {
      return response_handler.send_error_response(res, "User not found", 404);
    }

    return response_handler.send_success_response(res, { safeUser }, 200);

  } catch (err) {
    console.error(`[GET CURRENT USER]:`, err);
    return handleCaughtError(err, res);
  }
};

module.exports = { user_signup, user_login, get_current_user };
