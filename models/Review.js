const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Review must have a title"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
      required: [true, "Review must have a rating"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
