const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");

//controller
const {createProAvailability} = require("../controller/pro_availability_cntrll");


//create pro routes
router.post("/create-availability", validate_auth_token,pro_access,createProAvailability);


module.exports = router;