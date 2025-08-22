// Import Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// MODEL
const ProAvailabilityModel = require("../models/pro_availability_model");


/** create pro availability
 * 
 * ENDPOINT : /api/pro/v1/create-availability
 * Table used : ProAvailabilityModel
 * 
 */
const createProAvailability = async (req, res) => {
  try {
    console.log(`[PRO AVAILABILITY REQUEST] ${new Date().toISOString()} - Body:`, req.body);

    const { pro_id, service_id, day_of_week, start_time, end_time } = req.body;

    if (!pro_id || !day_of_week || !start_time || !end_time) {
      return response_handler.send_error_response(res, "pro_id, day_of_week, start_time, end_time are required", 400);
    }

    const existingSlot = await ProAvailabilityModel.findOne({
      where: {
        pro_id,
        day_of_week,
        start_time,
        end_time
      }
    });

    if (existingSlot) {
      return response_handler.send_error_response(res, "Time slot already exists for this Pro", 409);
    }

    // Create slot
    const slot = await ProAvailabilityModel.create({
      pro_id,
      service_id,
      day_of_week,
      start_time,
      end_time,
      is_booked:false
    });

    return response_handler.send_success_response(res, "Pro availability slot created successfully", 201, slot);

  } catch (error) {
    console.error("[CREATE PRO AVAILABILITY ERROR]:", error);
    return handleCaughtError(error, res);
  }
};

module.exports = {
  createProAvailability
};