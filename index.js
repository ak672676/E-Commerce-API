const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = require("./utils/dbConnect");
const notFound = require("./routes/notFound");
const errorMiddleware = require("./middleware/errorMiddleware");

const user = require("./routes/userRoute");
const product = require("./routes/productRoute");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/api/v1/user", user);
app.use("/api/v1/product", product);


app.use(notFound);
app.use(errorMiddleware);

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
