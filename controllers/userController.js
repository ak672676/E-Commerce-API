const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary");
const crypto = require("crypto");
const User = require("../models/User");
const res = require("express/lib/response");
const { sendMail } = require("../utils/sendEmail");

// Register a user
const registerUser = async (req, res) => {
  const file = req.files.profilePic;
  const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "giftsoft",
  });

  const { firstName, lastName, email, password } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE.slice(0, -1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCodes.OK).cookie("token", token, options).json({
    success: true,
    user: user,
    token: token,
  });
};

// Login a user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("Please Enter Email & Password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("Invalid email or password"));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Error("Invalid email or password"));
  }

  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE.slice(0, -1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCodes.OK).cookie("token", token, options).json({
    success: true,
    user: user,
    token: token,
  });
};

// Logout a user
const logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "logout successfully",
  });
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error("User not found"));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: `Giftshop Password Recovery`,
      message,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
      resetToken,
    });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Error(e.message));
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new Error("Reset Password Token is invalid or has been expired")
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("Password does not password"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  const updatedUser = await User.findOne({ email: user.email });
  const token = updatedUser.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE.slice(0, -1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCodes.OK).cookie("token", token, options).json({
    success: true,
    user: updatedUser,
    token: token,
  });
};

// Add Address
const addNewAddress = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("User not found"));
  }

  const address = { ...req.body };
  user.addresses.push(address);
  await user.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Address added successfully",
    address,
  });
};

// Delete Address
const deleteAddress = async function (req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("User not found"));
  }

  const address = user.addresses.id(req.query.mid);

  if (!address) {
    return next(new Error("Address not found"));
  }

  address.remove();
  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Address deleted successfully",
  });
};

// Update Address
const updateAddress = async function (req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("User not found"));
  }

  const address = user.addresses.id(req.query.mid);

  if (!address) {
    return next(new Error("Address not found"));
  }

  for (let key in req.body) {
    address[key] = req.body[key];
  }

  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Address updated successfully",
  });
};

// Get Address
const getAddress = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("User not found"));
  }

  const address = user.addresses.id(req.query.mid);

  if (!address) {
    return next(new Error("Address not found"));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    address,
  });
}

// Admin Only

// Get user
const getUserDetails = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

//Update User Role
const updateUserRole = async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

const getAllUsers = async function (req, res) {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
};

module.exports = {
  getUserDetails,
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  updateUserRole,
  getAllUsers,
  addNewAddress,
  deleteAddress,
  updateAddress,
  getAddress,
};
