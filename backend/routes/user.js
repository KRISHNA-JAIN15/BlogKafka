const {
  login,
  signup,
  logout,
  verifyEmail,
  resendVerificationCode,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/user");
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/checkAuth");
const { upload } = require("../utils/cloudinary");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

// Protected routes
router.get("/protected", checkAuth, (req, res) => {
  res.status(200).json({ message: "You are authorized", user: req.user });
});

// Profile routes
router.get("/profile", checkAuth, getProfile);
router.put(
  "/profile",
  checkAuth,
  upload.single("profilePicture"),
  updateProfile
);
router.put("/change-password", checkAuth, changePassword);

module.exports = router;
