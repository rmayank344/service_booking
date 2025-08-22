const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");

//controller
const {createRating, getAllRatings, getRatingById} = require("../controller/rating_cntrll");

//give rating routes
router.post('/create-rating', validate_auth_token, createRating);
router.get('/getAll-rating', validate_auth_token, getAllRatings);
router.get('/getId-rating', validate_auth_token, getRatingById);


module.exports = router;