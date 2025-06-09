const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be between 3 and 32 characters long")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("profileImg")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"]) // Adjust the locale as needed
    .withMessage(
      "Phone number must be a valid mobile phone number for Egypt or Saudi Arabia"
    ),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"), // rule for validating User ID format
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"), // rule for validating User ID format
  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("profileImg")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"]) // Adjust the locale as needed
    .withMessage(
      "Phone number must be a valid mobile phone number for Egypt or Saudi Arabia"
    ),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"), // rule for validating User ID format
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
  body("password")
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (value, { req }) => {
      // (1) Verify Current Password
      const user = await User.findById(req.params.id);

      if (!user) throw new Error("User not found");

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) throw new Error("Current password is incorrect");

      //  (2) Verify Confirm Password
      if (value !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation do not match");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) =>
      User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"]) // Adjust the locale as needed
    .withMessage(
      "Phone number must be a valid mobile phone number for Egypt or Saudi Arabia"
    ),
  validatorMiddleware,
];
