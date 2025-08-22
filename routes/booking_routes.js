const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");
const { loginRateLimiter } = require('../middleware/rateLimiter');

// controller
const {createBooking, confirmBooking} = require("../controller/booking_cntrll");

// Booking routes
router.post("/create-booking", validate_auth_token, loginRateLimiter, createBooking);
router.post("/confirm-booking", validate_auth_token, pro_access, confirmBooking);


module.exports = router;