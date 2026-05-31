const {
  register, logout, SendOtp, verifyOtp, login, ResetPassword,
  changePassword, getProfile, updateProfile, deleteProfilePhoto,
  loginWithGoogle, SendEmailCode, verifyEmailCode, getAllUser,
  getUserById, toggleBlockUser, deleteUser, getAdminStats
} = require("../controller/authcontroller");
const { auth } = require("../middleware/authenticate");
const upload = require("../middleware/uploadMiddleware");

const router = require("express").Router();

// Auth
router.post("/register", register);
router.get("/logout", logout);
router.post("/sendotp", SendOtp);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.post("/login-with-google", loginWithGoogle);

// Password
router.post("/resetpassword", ResetPassword);
router.post("/change-password", auth, changePassword);

// Profile
router.get("/profile", auth, getProfile);
router.put("/profile/update", auth, upload.single('profilePhoto'), updateProfile);
router.delete("/profile/photo", auth, deleteProfilePhoto);

// Email code
router.post("/send-code", SendEmailCode);
router.post("/verify-code", verifyEmailCode);

// Admin user management
router.get("/getalluser", getAllUser);
router.get("/admin/stats", getAdminStats);
router.get("/admin/users/:id", getUserById);
router.put("/admin/users/:id/block", toggleBlockUser);
router.delete("/admin/users/:id", deleteUser);

module.exports = router;