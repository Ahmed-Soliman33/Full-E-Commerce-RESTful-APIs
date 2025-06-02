const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Brand = require("../models/Brand");

// @desc Create a new brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({ data: brand });
});

// @desc Get all brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: brands.length, data: brands });
});

// @desc Get Brand by ID
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`Brand with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc Update specific Brand
// @route PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
    }
  );
  if (!brand) {
    return next(new ApiError(`Brand with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc Delete specific Brand
// @route DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    // res.status(404).json({ msg: `Brand with id: ${id} not found` });
    return next(new ApiError(`Brand with id: ${id} not found`, 404));
  }

  res.status(200).send();
});
