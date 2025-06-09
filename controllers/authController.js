const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public

exports.signup = asyncHandler(async (req, res) => {
  // (1) Create a new user
  const user = await User.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    email: req.body.email,
    password: req.body.password,
  });

  // (2) Generate Token and send it to the client
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  // (1) Check if user exists
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // (2) Generate Token and send it to the client
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  // (1) Check if token exists and Get token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in, please log in first to get access",
        401
      )
    );
  }

  // (2) verify token ( no change happens or expired token )

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // (3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser)
    return next(
      new ApiError("The user that belong to this token does no longer exist")
    );

  // (4) check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      // Convert to seconds from milliseconds
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed password! Please log in again..",
          401
        )
      );
    }
  }

  req.user = currentUser; // Attach user to request object

  next();
});

exports.checkAccountActive = asyncHandler(async (req, res, next) => {
  if (!req.user.active) {
    return next(
      new ApiError(
        "Your account has been deactivated, please activate your account",
        401
      )
    );
  }
  next();
});

// @desc   Authorization   (User Permissions)
exports.allowedTo = (...roles) =>
  // ...roles: ["admin", "manager", "user"]
  asyncHandler(async (req, res, next) => {
    // (1) Check if user has one of the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Your role ${req.user.role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  });

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // (1) Check if user exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(
      new ApiError(
        `There is no user with this email address: ${req.body.email} `,
        404
      )
    );
  }

  // (2) Generate reset code ( 6 digits random number ) that will be sent to user
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // (3) Hash the reset code and store it in the database
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  // (4) Set the password reset code expiration time to ( 10 minutes )
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // (5) Send the reset code to the user via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      // message: `Your password reset code is: ${resetCode} (valid for 10 minutes)`,
      html: `
      <h4>Hi ${user.name}</h4>
      <p>We received a request to reset your password on Eshop Account.</p>
      <b>${resetCode}</b>
       <br />
       <p>Enter this code to complete reset your password</p>
      <span>This code will expire in 10 minutes.</span>
      <p>Best Regards,<br />Eshop Team</p>
      `,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError(`There was an error sending the email`, 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to your email" });
});

// @desc   Verify Password Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // (1) get user based on Reset Code

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ApiError("Reset Code invalid or has expired.. Please try again", 404)
    );
  }
  // (2) Set passwordResetVerified to true and save the user
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
});

// @desc   Reset Password
// @route   PUT /api/v1/auth/resetPassword
// @access  Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // (1) get user based on email
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("There is no user with this email address", 404));
  }

  // (2) Check if password Reset is Verified
  if (!user.passwordResetVerified) {
    return next(
      new ApiError("Reset Code not verified.. Please try again", 404)
    );
  }

  // (3) Update password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // (4) Generate Token and send it to the client
  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});
