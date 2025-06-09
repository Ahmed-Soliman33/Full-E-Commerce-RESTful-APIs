const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(protect, allowedTo("user"), createReview)
  .get(getReviews);

router
  .route("/:id")
  .get(getReviewById)
  .put(protect, allowedTo("user"), updateReview)
  .delete(protect, allowedTo("admin", "manager", "user"), deleteReview);
module.exports = router;
