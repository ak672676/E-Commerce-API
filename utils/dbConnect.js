const mongoose = require("mongoose");
const connectDB = function (url) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
  });
};

module.exports = connectDB;
