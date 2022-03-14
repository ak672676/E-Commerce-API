const {
  createProduct,
  getAllProductAdmin,
  getProductDetailsAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  createProductReview,
  removeProductReview,
  updateProductReview,
  getProductReview,
} = require("../controllers/productController");
const { isAuthenticatedUser } = require("../utils/isAuthenticatedUser");
const { isAdmin } = require("../utils/isAdmin");
const router = require("express").Router();

router
  .route("/review/:id")
  .post(isAuthenticatedUser, createProductReview)
  .delete(isAuthenticatedUser, removeProductReview)
  .patch(isAuthenticatedUser, updateProductReview)
  .get(isAuthenticatedUser, getProductReview);

// Admin Routes
router.route("/admin").post(isAdmin, createProduct);
router.route("/admin").get(isAdmin, getAllProductAdmin);
router
  .route("/admin/:id")
  .get(isAdmin, getProductDetailsAdmin)
  .patch(isAdmin, updateProductAdmin)
  .delete(isAdmin, deleteProductAdmin);

module.exports = router;
