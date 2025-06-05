const SubCategory = require("../models/SubCategory");
const factory = require("./factoryController");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.craeteFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

// @desc Create a new SubCategory
// @route POST /api/v1/subcategories
// @access Private

exports.createSubCategory = factory.createOne(SubCategory);

// @desc Get all SubCategories
// @route GET /api/v1/subcategories
// @access Public

exports.getSubCategories = factory.getAll(SubCategory);

// @desc Get SubCategory by ID
// @route GET /api/v1/subcategories/:id
// @access Public

exports.getSubCategoryById = factory.getOne(SubCategory);

// @desc Update specific SubCategory
// @route PUT /api/v1/subcategories/:id
// @access Private

exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc Delete specific SubCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
