const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserRole,
  getAllUsers,
  addNewAddress,
  deleteAddress,
  updateAddress,
  getAddress,
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../utils/isAuthenticatedUser");
const { isAdmin } = require("../utils/isAdmin");

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(logout);
router.route("/forgotpassword").get(isAuthenticatedUser, forgotPassword);
router.route("/resetPassword/:token").get(resetPassword);

router
  .route("/address/:id")
  .post(isAuthenticatedUser, addNewAddress)
  .delete(isAuthenticatedUser, deleteAddress)
  .patch(isAuthenticatedUser, updateAddress)
  .get(isAuthenticatedUser, getAddress);

// Admin
router.route("/:id").get(getUserDetails);
router.route("/updateRole/:id").put(updateUserRole);
router.route("/").get(isAdmin, getAllUsers);

module.exports = router;
