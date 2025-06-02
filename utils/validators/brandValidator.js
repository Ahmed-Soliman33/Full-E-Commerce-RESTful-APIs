const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddelware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"), // rule for validating Brand ID format
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Brand name must be between 3 and 32 characters long"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"), // rule for validating Brand ID format
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"), // rule for validating Brand ID format
  validatorMiddleware,
];
