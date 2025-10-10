const { login, signup } = require("../controllers/user");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", checkAuth, (req, res) => {
  res.status(200).json({ message: "You are authorized", user: req.user });
});

module.exports = router;
