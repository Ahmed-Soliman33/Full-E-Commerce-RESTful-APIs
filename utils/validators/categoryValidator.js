const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddelware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"), // rule for validating category ID format
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters long"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"), // rule for validating category ID format
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"), // rule for validating category ID format
  validatorMiddleware,
];
