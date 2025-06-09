const Review = require("../models/Review");
const factory = require("./factoryController");

// @desc Create a new Review
// @route POST /api/v1/reviews
// @access Private

exports.createReview = factory.createOne(Review);

// @desc Get all reviews
// @route GET /api/v1/reviews
// @access Public

exports.getReviews = factory.getAll(Review);

// @desc Get Review by ID
// @route GET /api/v1/reviews/:id
// @access Public

exports.getReviewById = factory.getOne(Review);

// @desc Update specific Review
// @route PUT /api/v1/reviews/:id
// @access Private

exports.updateReview = factory.updateOne(Review);

// @desc Delete specific Review
// @route DELETE /api/v1/reviews/:id
// @access Private

exports.deleteReview = factory.deleteOne(Review);
