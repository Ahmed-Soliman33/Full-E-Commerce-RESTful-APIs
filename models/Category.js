const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [32, "Category name must be at most 50 characters long"],
    },
    slug: {
      // Slug is a URL-friendly version of the category name ( A and B >>> a-and-b )
      type: String,
      lowercase: true,
    },
    image: {
      // Image URL for the category
      type: String,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Category", categorySchema);
