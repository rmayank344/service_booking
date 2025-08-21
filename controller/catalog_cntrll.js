// Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// MODEL
const CATEGORYMODEL = require("../models/category_model");
const SERVICEMODEL = require("../models/service_model");
const ADDONMODEL = require("../models/add_on_model");

/** Create Ctaegory Api
 * 
 * ENDPOINT : /api/admin/v1/category/create-categories
 * Table used : CATEGORYMODEL
 * 
 */
const createCategory = async (req, res) => {
  try {
    console.log(`[CATEGORY REQUEST] ${new Date().toISOString()} - Body:`, req.body);
    const { name, description, is_active } = req.body;

    if (!name) {
      return response_handler.send_error_response(res, "Category name is required", 400);
    }

    // Check if category already exists
    const existing = await CATEGORYMODEL.findOne({ where: { name } });
    if (existing) {
      return response_handler.send_error_response(res, "Category with this name already exists", 409);
    }

    // Create category
    const category = await CATEGORYMODEL.create({
      name,
      description,
      is_active: is_active ?? true,
    });

    return response_handler.send_success_response(res, "Category created successfully", 201, category);

  } catch (error) {
    console.error(`[CREATE CATEGORY ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};

/** get Ctaegory Api
 * 
 * ENDPOINT : /api/user/v1/category/get-categories
 * Table used : CATEGORYMODEL
 * 
 */

const getCategories = async (req, res) => {
  try {
    console.log(`[CATEGORY REQUEST] ${new Date().toISOString()} - Query:`, req.query);

    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    // Fetch categories with pagination
    const { count, rows } = await CATEGORYMODEL.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    return response_handler.send_success_response(
      res,
      "Categories fetched successfully",
      200,
      {
        categories: rows,
        pagination: {
          totalItems: count,
          currentPage: page,
          totalPages,
          pageSize: limit
        }
      }
    );

  } catch (error) {
    console.error(`[GET CATEGORIES ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};


/** get Single Category Api
 * 
 * ENDPOINT : /api/user/v1/category/get-single-categories?id={}
 * Table used : CATEGORYMODEL
 * 
 */

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.query;

    const category = await CATEGORYMODEL.findOne({where:{category_id : id}, raw: true});

    if (!category) {
      return response_handler.send_error_response(
        res,
        "Category not found",
        404
      );
    }

    return response_handler.send_success_response(
      res,
      "Category fetched successfully",
      200,
      category
    );
  } catch (error) {
    return response_handler.send_error_response(res, error.message, 500);
  }
};

/** create service Category Api
 * 
 * ENDPOINT : api/admin/v1/catalog/create-service
 * Table used : SERVICEMODEL, CATEGORYMODEL
 * 
 */

const createService = async (req, res) => {
  try {
    console.log(" Incoming Request - POST /create-service:", req.body);
    const { category_id, service_name, service_description, price } = req.body;

    if (!category_id || !service_name || !service_description || !price) {
      return response_handler.send_error_response(
        res,
        "Category ID, service name and description are required",
        400
      );
    }

    // Check if category exists
    const category = await CATEGORYMODEL.findOne({
      where: { category_id },
      raw: true
    });

    if (!category) {
      return response_handler.send_error_response(
        res,
        "Category not found",
        404
      );
    }

    // Create service under the category
    const service = await SERVICEMODEL.create({
      category_id,
      name: service_name,
      description: service_description,
      base_price: price
    });

    return response_handler.send_success_response(
      res,
      "Service created successfully",
      201,
      service
    );
  } catch (error) {
    console.error("Error in POST /create-service:", error);
    return response_handler.send_error_response(res, error.message, 500);
  }
};

/** get service By Category Id Api
 * 
 * ENDPOINT : api/user/v1/catalog/get-services?categoryId=&page=
 * Table used : SERVICEMODEL, CATEGORYMODEL
 * 
 */

const get_services = async (req, res) => {
  try {
    console.log(`[SERVICE REQUEST] ${new Date().toISOString()} - Query:`, req.query);

    let { categoryId, page, limit } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = { is_active: true };

    // If categoryId is provided, validate and filter
    if (categoryId) {
      const category = await CATEGORYMODEL.findOne({
        where: { category_id: categoryId },
        attributes: ['category_id'],
        raw: true
      });

      if (!category) {
        return response_handler.send_error_response(res, "Category not found", 404);
      }

      whereClause.category_id = Number(categoryId);
    }

    // Fetch services with pagination
    const { count, rows } = await SERVICEMODEL.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['service_id', 'ASC']], // change to DESC if you want latest first
      raw: true
    });

    const totalPages = Math.ceil(count / limit);

    return response_handler.send_success_response(
      res,
      "Services fetched successfully",
      200,
      {
        services: rows,
        pagination: {
          totalItems: count,
          currentPage: page,
          totalPages,
          pageSize: limit
        }
      }
    );

  } catch (error) {
    console.error(`[GET SERVICES ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};

/** get service ID By Category Id Api
 * 
 * ENDPOINT : api/user/v1/catalog/get-single-services?serviceId={}
 * Table used : SERVICEMODEL, CATEGORYMODEL
 * 
 */

const getServiceById = async (req, res) => {
  try {
    console.log(" Incoming Request - POST /get-single-services?serviceId={req.query}", req.body);
    const { serviceId } = req.query;

    const service = await SERVICEMODEL.findOne({where:{service_id : serviceId, is_active: 1}, raw: true});

    if (!service) {
      return response_handler.send_error_response(
        res,
        "Service not found",
        404
      );
    }

    return response_handler.send_success_response(
      res,
      "Category fetched successfully",
      200,
      service
    );
  } catch (error) {
    console.error("Error in POST /get-single-services?serviceId={req.query}:", error);
    return response_handler.send_error_response(res, error.message, 500);
  }
};

/** create addOn By service Id Api
 * 
 * ENDPOINT : api/user/v1/catalog/services/addons
 * Table used : SERVICEMODEL, ADDONMODEL
 * 
 */

const create_addon = async (req, res) => {
  try {
    console.log(" Incoming Request - POST /addons", req.body);

    const { service_id, name, price } = req.body;

    if (!service_id || !name || !price) {
      return response_handler.send_error_response(
        res,
        "service_id, name, and price are required",
        400
      );
    }

    const service = await SERVICEMODEL.findOne({ where: { service_id } });
    if (!service) {
      return response_handler.send_error_response(
        res,
        "service not found.",
        400
      );
    }

    const addon = await ADDONMODEL.create({ 
      service_id, 
      name, 
      extra_price: price 
    });

      return response_handler.send_success_response(
      res,
      "Service addon created successfully",
      201,
      addon,
    );
  } catch (error) {
    console.error("Error in POST /addons:", error);
   return handleCaughtError(error, res);
  }
};

/** get addOn By service Id Api
 * 
 * ENDPOINT : api/user/v1/catalog/services/addonsId?service_id={}
 * Table used : SERVICEMODEL, ADDONMODEL
 * 
 */

const get_service_addons = async (req, res) => {
  try {
   console.log(" Incoming Request - POST /addons?service_id={}", req.query);

    const { service_id } = req.query;

    if (!service_id) {
      return response_handler.send_error_response(
        res,
        "service_id is required",
        400
      );
    }

    const addons = await ADDONMODEL.findAll({
      where: { service_id },
      order: [["createdAt", "DESC"]],
    });

    return response_handler.send_success_response(
      res,
      "Service addons fetched successfully",
      200,
      addons,
    );
  } catch (error) {
    console.error("Incoming Request - POST /addons?service_id={}", error);
    return handleCaughtError(error, res);
  }
};

module.exports = {
  createCategory, 
  getCategories, 
  getCategoryById, 
  createService, 
  get_services, 
  getServiceById,
  create_addon,
  get_service_addons,
};