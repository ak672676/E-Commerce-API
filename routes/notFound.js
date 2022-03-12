const { StatusCodes } = require("http-status-codes");
const notFound = function (req, res) {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: "Not Found" });
};
module.exports = notFound;
