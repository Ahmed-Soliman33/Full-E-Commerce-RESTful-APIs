const Category = require("../models/Category");
const factory = require("./factoryController");

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private

exports.createCategory = factory.createOne(Category);

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public

exports.getCategories = factory.getAll(Category);

// @desc Get category by ID
// @route GET /api/v1/categories/:id
// @access Public

exports.getCategoryById = factory.getOne(Category);

// @desc Update specific category
// @route PUT /api/v1/categories/:id
// @access Private

exports.updateCategory = factory.updateOne(Category);

// @desc Delete specific category
// @route DELETE /api/v1/categories/:id
// @access Private

exports.deleteCategory = factory.deleteOne(Category);
