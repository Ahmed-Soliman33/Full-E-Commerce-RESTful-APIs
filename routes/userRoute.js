const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateMyAccount,
  activateMyAccount,
} = require("../controllers/userController");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const {
  protect,
  allowedTo,
  checkAccountActive,
} = require("../controllers/authController");

const router = express.Router();

// Logged User
router.use(protect);
router.post("/activateMyAccount", activateMyAccount);

router.use(checkAccountActive);
router.get("/profileData", getLoggedUserData, getUserById);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMyData", updateLoggedUserData);
router.delete("/deactivateMyAccount", deactivateMyAccount);

// Private For Admin
router.use(allowedTo("admin", "manager"));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router.route("/").post(createUserValidator, createUser).get(getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
