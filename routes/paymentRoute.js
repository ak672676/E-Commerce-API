const router = require("express").Router();
const { getOrderId, verifyOrder } = require("../controllers/paymentController");
router.route("/order").post(getOrderId);
router.route("/verify").post(verifyOrder);

module.exports = router;
