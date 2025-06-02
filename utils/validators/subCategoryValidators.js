const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddelware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("SubCategory name must be between 2 and 32 characters long"),

  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to a Parent Category")
    .isMongoId()
    .withMessage("Invalid category id format"),

  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id is required")
    .isMongoId()
    .withMessage("Invalid SubCategory id format"), // rule for validating SubCategory ID format
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id is required")
    .isMongoId()
    .withMessage("Invalid SubCategory id format"),
];
exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id is required")
    .isMongoId()
    .withMessage("Invalid SubCategory id format"),
];
