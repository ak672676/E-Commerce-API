const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./utils/dbConnect");

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const port = 3500 || process.env.PORT;

const startBackend = async function () {
  try {
    await connectDB(process.env.DB_URI);
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (e) {
    process.exit(1);
  }
};

startBackend();
