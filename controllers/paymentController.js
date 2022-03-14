const { StatusCodes } = require("http-status-codes");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const getOrderId = (req, res, next) => {
  console.log("getOrderId");
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Something Went Wrong!" });
      }
      res.status(StatusCodes.OK).json({ data: order });
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

const verifyOrder = (req, res, next) => {
  console.log("verify order");

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Payment verified successfully" });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

module.exports = {
  getOrderId,
  verifyOrder,
};
