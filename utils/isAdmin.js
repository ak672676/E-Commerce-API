const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isAdmin = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Error("Please login first"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  if (req.user.role !== "admin") {
    return next(new Error("You are not authorized to perform this action"));
  }

  next();
};

module.exports = { isAdmin };
