const sequelize = require("../config/sql_config");

// Import Utils
const response_handler = require("../utils/response_handler");
const handleCaughtError = require("../utils/handle_error");

// MODELS
const RatingModel = require("../models/rating_model");
const BookingModel = require("../models/booking_model");

/** create rating api
 * 
 * ENDPOINT : /api/user/v1/rating/create-rating
 * Table used : Rating Model
 * 
 */

const createRating = async (req, res) => {
  console.log(`[CREATE RATING REQUEST]:`, req.body);

  const transaction = await sequelize.transaction();

  try {
    const { booking_id, pro_id, rating, review } = req.body;

    if (!booking_id || !pro_id || !rating) {
      await transaction.rollback();
      return response_handler.send_error_response(
        res,
        "Missing required fields",
        400
      );
    }

     const booking = await BookingModel.findOne({
      where: { booking_id: booking_id, customer_id:req.id, pro_id, booking_status: "COMPLETED" },
    });

    if (!booking) {
      await transaction.rollback();
      return response_handler.send_error_response(
        res,
        "Invalid booking. Either not found or not completed.",
        400
      );
    }

    const existingRating = await RatingModel.findOne({
      where: { booking_id },
      transaction,
    });

    if (existingRating) {
      await transaction.rollback();
      return response_handler.send_error_response(
        res,
        "You have already rated this booking.",
        400
      );
    }

    const newRating = await RatingModel.create(
      {
        booking_id,
        pro_id,
        customer_id: req.id,
        rating,
        review,
      },
      { transaction }
    );

    await transaction.commit();

    return response_handler.send_success_response(
      res,
      "Rating submitted successfully",
      201,
      newRating
    );
  } catch (error) {
    await transaction.rollback();
    console.error(`[CREATE RATING ERROR]:`, error);
    return handleCaughtError(error, res);
  }
};

/** get all rating api
 * 
 * ENDPOINT : /api/user/v1/rating/getAll-rating
 * Table used : Rating Model
 * 
 */

const getAllRatings = async (req, res) => {
  console.log("[GET ALL RATINGS REQUEST]");

  try {
    const ratings = await RatingModel.findAll();

    if (!ratings || ratings.length === 0) {
      return response_handler.send_error_response(
        res,
        "No ratings found",
        404
      );
    }

    return response_handler.send_success_response(
      res,
      "Ratings fetched successfully",
      200,
      ratings
    );
  } catch (error) {
    console.error("[GET ALL RATINGS ERROR]:", error);
    return handleCaughtError(error, res);
  }
};

const getRatingById = async (req, res) => {
  console.log("[GET RATING BY ID REQUEST]:", req.query);

  try {
    const { id } = req.query;

    if (!id) {
      return response_handler.send_error_response(
        res,
        "Rating ID is required in query params",
        400
      );
    }

    const rating = await RatingModel.findOne({ where: { rating_id:id },raw:true });

    if (!rating) {
      return response_handler.send_error_response(
        res,
        "Rating not found",
        404
      );
    }

    return response_handler.send_success_response(
      res,
      "Rating fetched successfully",
      200,
      rating
    );
  } catch (error) {
    console.error("[GET RATING BY ID ERROR]:", error);
    return handleCaughtError(error, res);
  }
};

module.exports = { createRating, getAllRatings, getRatingById};