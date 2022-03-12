const { StatusCodes } = require("http-status-codes");
module.exports = function (err, req, res, next) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message,
  });
};
