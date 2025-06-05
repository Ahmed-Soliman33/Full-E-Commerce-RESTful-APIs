const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({
      min: 2,
      max: 32,
    })
    .withMessage("SubCategory name must be between 2 and 32 characters long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

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
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id is required")
    .isMongoId()
    .withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];
