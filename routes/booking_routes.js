const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");

// controller
const {createBooking, confirmBooking} = require("../controller/booking_cntrll");

// Booking routes
router.post("/create-booking", validate_auth_token, createBooking);
router.post("/confirm-booking", validate_auth_token, pro_access, confirmBooking);


module.exports = router;