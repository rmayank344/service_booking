// Import Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// MODELS
const CustomerAddressModel = require("../models/customer_address");
const ProCoverageModel = require("../models/pro_address_model");

/** customer add address Api
 * 
 * ENDPOINT : /api/user/v1/location/add-address
 * Table used : address_model
 * 
 */

const add_customer_address = async (req, res) => {
  try {
    console.log("Incoming Request - POST /customers/address", req.body);

    const { customer_id, address_line, city, state, pincode, latitude, longitude } = req.body;

    if (!customer_id || !address_line || !city || !pincode) {
      return response_handler.send_error_response(
        res,
        "customer_id, address_line, city, and pincode are required",
        400
      );
    }

    const newAddress = await CustomerAddressModel.create({
      customer_id,
      address_line,
      city,
      state,
      pincode,
      latitude,
      longitude,
    });

    return response_handler.send_success_response(
      res,
      "Customer address added successfully",
      201,
      newAddress
    );
  } catch (error) {
    console.error("Error in POST /customers/address", error);
    return handleCaughtError(error, res);
  }
};

/** pro add coverage Api
 * 
 * ENDPOINT : /api/user/v1/location/pro-add-coverage
 * Table used : address_model
 * 
 */
const addProCoverage = async (req, res) => {
  try {
    console.log("Incoming Request - POST /pro-add-coverage", req.body);

    const { pro_id, pincode, latitude, longitude, radius_km } = req.body;

    if (!pro_id || !pincode) {
      return response_handler.send_error_response(
        res,
        "pro_id and pincode are required",
        400
      )
    }

    const newCoverage = await ProCoverageModel.create({
      pro_id,
      pincode,
      latitude: latitude || null,
      longitude: longitude || null,
      radius_km: radius_km || 5,
    });

    return response_handler.send_success_response(res, "Coverage area added successfully", 201, newCoverage);
  } catch (error) {
    console.error("Error in POST /pro-add-coverage", error);
    return handleCaughtError(error, res);
  }
};

/** pro nearby coverage Api
 * 
 * ENDPOINT : /api/user/v1/location/pro/nearby?latitude={}&longitude={}&radius={}
 * Table used : pro_model
 * 
 */
const getNearbyPros = async (req, res) => {
  try {
    console.log("Incoming Request - POST /pro/nearby?latitude={}&longitude={}&radius={}", req.body);
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return response_handler.send_error_response(
        res,
        "latitude & longitude are required",
        400
      );
    }

    const searchRadius = radius ? parseFloat(radius) : 5;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const nearbyPros = await ProCoverageModel.sequelize.query(
      `
      SELECT address_id, pro_id, pincode, latitude, longitude, radius_km,
        (6371 * acos(
            cos(radians(:userLat)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(:userLon)) +
            sin(radians(:userLat)) *
            sin(radians(latitude))
        )) AS distance
      FROM ProCoverage
      HAVING distance <= :searchRadius
      ORDER BY distance ASC
      `,
      {
        replacements: { userLat, userLon, searchRadius },
        type: ProCoverageModel.sequelize.QueryTypes.SELECT,
      }
    );

    return response_handler.send_success_response(
      res,
      "Nearby pros fetched successfully",
      200,
      nearbyPros
    );
  } catch (error) {
    console.error("Error in POST /pro/nearby?latitude={}&longitude={}&radius={}", error);
    return handleCaughtError(error, res);
  }
};
module.exports = { add_customer_address, addProCoverage, getNearbyPros };