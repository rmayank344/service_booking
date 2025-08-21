const express = require('express');
const router = new express.Router();

// middleware
const {validate_auth_token, admin_access, pro_access} = require("../middleware/authentication");

//contoller
const {
  createCategory, 
  getCategories, 
  getCategoryById, 
  createService, 
  get_services,
  getServiceById,
  create_addon,
  get_service_addons
} = require("../controller/catalog_cntrll");

// create category routes
router.post('/create-categories', validate_auth_token, admin_access, createCategory);
router.get('/get-categories', validate_auth_token, getCategories);
router.get('/get-single-categories', validate_auth_token, getCategoryById);
router.post('/create-service', validate_auth_token, admin_access, createService);
router.get('/get-services', validate_auth_token, get_services);
router.get('/get-single-services', validate_auth_token, getServiceById);
router.post('/services/addons', validate_auth_token, admin_access, create_addon);
router.post('/services/addonsId', validate_auth_token, get_service_addons);

module.exports = router;