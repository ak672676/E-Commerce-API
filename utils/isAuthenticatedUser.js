const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Error("Please login first"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
};

module.exports = { isAuthenticatedUser };
