const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/sql_config");

// Import Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// MODELS
const BookingModel = require("../models/booking_model");
const SERVICEMODEL = require("../models/service_model");
const ProAvailabilityModel = require("../models/pro_availability_model");
const ADDONMODEL = require("../models/add_on_model");

/** create booking model
 * 
 * ENDPOINT : /api/user/v1/create-booking
 * Table used : ProAvailabilityModel
 * 
 */
const createBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log(`[BOOKING REQUEST] ${new Date().toISOString()} - Body:`, req.body);

    const { customer_id, start_time, end_time, service_id, slot_id, addons = [] } = req.body;

    if (!customer_id || !service_id || !slot_id) {
      return response_handler.send_error_response(res, "Missing required fields", 400);
    }

    // Check if slot exists (do not lock for booking creation yet)
    const slot = await ProAvailabilityModel.findOne({ where: { slot_id } });
    if (!slot) {
      return response_handler.send_error_response(res, "Slot not found", 404);
    }

    // Calculate total price (service base price + addons)
    const service = await SERVICEMODEL.findOne({ where: { service_id } });
    if (!service) {
      return response_handler.send_error_response(res, "Service not found", 404);
    }

    let total_price = parseFloat(service.base_price);

    if (addons.length > 0) {
      const addonRecords = await ADDONMODEL.findAll({ where: { addon_id: addons } });
      addonRecords.forEach(a => {
        total_price += parseFloat(a.extra_price || 0);
      });
    }

    // Apply weekend +10% dynamic price
    const dayOfWeek = new Date().getDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      total_price = total_price + total_price * 0.1;
    }

    // Create booking
    const booking = await BookingModel.create(
      {
        customer_id,
        service_id,
        slot_id,
        addon_ids : addons || null,
        total_price,
        start_time,
        end_time,
        status: "PENDING",
        idempotency_key: uuidv4(),
      },
      { transaction: t }
    );

    await t.commit();

    return response_handler.send_success_response(
      res,
      "Booking created successfully. Waiting for Pro confirmation.",
      201,
      booking
    );

  } catch (error) {
    await t.rollback();
    console.error(`[CREATE BOOKING ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};

/** confirm/cancelled/completed booking API
 * 
 * ENDPOINT : /api/pro/v1/confirm-booking
 * Table used : ProAvailabilityModel, bookingmodel
 * 
 */
const confirmBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log(`[PRO CONFIRM BOOKING] ${new Date().toISOString()} - Body:`, req.body);

    const { booking_id, pro_id, key } = req.body;

    if (!booking_id || !pro_id || !key) {
      return response_handler.send_error_response(res, "Missing required fields", 400);
    }

    console.log(`[${pro_id}] Trying to acquire lock on booking ${booking_id}`);
    const booking = await BookingModel.findOne({
      where: { booking_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log(`[${pro_id}] Lock acquired on booking ${booking_id}`);

    if (!booking) {
      return response_handler.send_error_response(res, "Booking not found", 404);
    }

       console.log(`[${pro_id}] Simulating long processing...`);
    await new Promise(resolve => setTimeout(resolve, 30000));

    const slot = await ProAvailabilityModel.findOne({
      where: { slot_id: booking.slot_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!slot) {
      return response_handler.send_error_response(res, "Slot not found", 404);
    }

    switch (key) {
      case "CONFIRMED":
        if (slot.is_booked) {
          return response_handler.send_error_response(res, "Slot is already booked", 409);
        }
        
        await ProAvailabilityModel.update(
          { is_booked: true },
          { where: { slot_id: slot.slot_id }, transaction: t }
        );
        booking.booking_status = "CONFIRMED";
        booking.pro_id = pro_id;
        await booking.save({ transaction: t });
        break;

      case "CANCELLED":
        // Release the slot
        await ProAvailabilityModel.update(
          { is_booked: false },
          { where: { slot_id: slot.slot_id }, transaction: t }
        );
        booking.booking_status = "CANCELLED";
        await booking.save({ transaction: t });
        break;

      case "COMPLETED":
        // Release the slot
        await ProAvailabilityModel.update(
          { is_booked: false },
          { where: { slot_id: slot.slot_id }, transaction: t }
        );
        booking.booking_status = "COMPLETED";
        await booking.save({ transaction: t });
        break;

      default:
        return response_handler.send_error_response(res, "Invalid key value", 400);
    }

    await t.commit();

    return response_handler.send_success_response(
      res,
      `Booking ${key.toLowerCase()} successfully`,
      200,
      booking
    );

  } catch (error) {
    await t.rollback();
    console.error(`[PRO CONFIRM BOOKING ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};

module.exports = { createBooking, confirmBooking };