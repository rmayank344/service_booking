const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");

//controller
const {add_customer_address, addProCoverage, getNearbyPros} = require("../controller/address_cntrll");

//customer add address routes
router.post("/add-address", validate_auth_token, add_customer_address);
router.get("/pro/nearby", validate_auth_token, getNearbyPros);

//pro add address routes
router.post("/pro-add-coverage", validate_auth_token, pro_access, addProCoverage);


module.exports = router;