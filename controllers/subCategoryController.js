const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategory");
const ApiError = require("../utils/ApiError");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc Create a new SubCategory
// @route POST /api/v1/subcategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ data: subCategory });
});

exports.craeteFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

// @desc Get all SubCategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1; // Default to page 1
  const limit = Number(req.query.limit) || 5; // Default to 5 items per page
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({
  //   path: "category",
  //   select: "name",
  // });

  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc Get SubCategory by ID
// @route GET /api/v1/subcategories/:id
// @access Public
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return next(new ApiError(`SubCategory with id: ${id} not found`, 404));
  }

  res.status(200).json({ date: subCategory });
});

// @desc Update specific SubCategory
// @route PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!subCategory) {
    // res.status(404).json({ msg: `Category with id: ${id} not found` });
    return next(new ApiError(`SubCategory with id: ${id} not found`, 404));
  }

  res.status(200).json({ date: subCategory });
});

// @desc Delete specific SubCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    // res.status(404).json({ msg: `Category with id: ${id} not found` });
    return next(new ApiError(`SubCategory with id: ${id} not found`, 404));
  }

  res.status(200).send();
});
