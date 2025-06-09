const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const factory = require("./factoryController");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Private For Admin ( CRUD operations on User )

// @desc Create a new User
// @route POST /api/v1/users
// @access Private

exports.createUser = factory.createOne(User);

// @desc Get all Users
// @route GET /api/v1/users
// @access Private

exports.getUsers = factory.getAll(User);

// @desc Get User by ID
// @route GET /api/v1/users/:id
// @access Private

exports.getUserById = factory.getOne(User);

// @desc Update specific User
// @route PUT /api/v1/users/:id
// @access Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: user });
});

// @desc Delete specific User
// @route DELETE /api/v1/users/:id
// @access Private

exports.deleteUser = factory.deleteOne(User);

// @desc Change User Password
// @route PUT /api/v1/users/:id
// @access Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12), // Assuming password is hashed before saving
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User with id: ${id} not found`, 404));
  }

  res.status(200).json({ data: user });
});

// ===============================================================

// Private For Logged User

// @desc Get User Data
// @route Get /api/v1/users/profileData
// @access Private/Protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update Logged User Password
// @route PUT /api/v1/users/changeMyPassword
// @access Private/Protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User not found`, 404));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc Update Logged User Data
// @route PUT /api/v1/users/changeMyData
// @access Private/Protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate Logged User
// @route   DELETE /api/v1/users/deactivateMyAccount
// @access  Private/Protected
exports.deactivateMyAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(204).json({ status: "success" });
});

// @desc    Activate Logged User
// @route   POST /api/v1/users/activateMyAccount
// @access  Private/Protected
exports.activateMyAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: true,
  });
  res.status(204).json({ status: "success" });
});
