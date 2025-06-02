const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name, slug: slugify(name) });

  res.status(201).json({ data: category });
});

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1; // Default to page 1
  const limit = Number(req.query.limit) || 5; // Default to 5 items per page
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  const categories = await Category.find({}).skip(skip).limit(limit);
  // .sort({ createdAt: -1 });

  res.status(200).json({ results: categories.length, data: categories });
});

// @desc Get category by ID
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `Category with id: ${id} not found` });
    return next(new ApiError(`Category with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc Update specific category
// @route PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true, // Return the updated document
      // runValidators: true, // Validate the update against the schema
    }
  );
  if (!category) {
    // res.status(404).json({ msg: `Category with id: ${id} not found` });
    return next(new ApiError(`Category with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc Delete specific category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    // res.status(404).json({ msg: `Category with id: ${id} not found` });
    return next(new ApiError(`Category with id: ${id} not found`, 404));
  }

  res.status(200).send();
});
