const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/user");
const { generateToken } = require("../utils/JsonWebToken");
const { sendVerificationEmail, sendWelcomeEmail } = require("../utils/email");

const signup = (req, res) => {
  const { username, email, password } = req.body;

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        verificationToken,
        isVerified: false,
      });

      newUser
        .save()
        .then((user) => {
          sendVerificationEmail(email, verificationToken);

          res.status(201).json({
            message:
              "User created successfully. Please check your email for verification code.",
            userId: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          res.status(500).json({ message: "Error creating user", error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error checking user", error: err });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          message: "Please verify your email before logging in",
          userId: user._id,
          email: user.email,
        });
      }

      user
        .matchPassword(password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
          }
          const token = generateToken({
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
          });
          res.setHeader("Authorization", `Bearer ${token}`);
          res.status(200).json({
            message: "Login successful",
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              isVerified: user.isVerified,
            },
            token,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Error matching password", error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error logging in", error: err });
    });
};

const verifyEmail = (req, res) => {
  const { email, verificationCode } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      if (user.verificationToken !== verificationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      user.isVerified = true;
      user.verificationToken = undefined;

      user
        .save()
        .then(() => {
          sendWelcomeEmail(user.email, user.username);

          res.status(200).json({
            message: "Email verified successfully! You can now log in.",
            userId: user._id,
          });
        })
        .catch((err) => {
          res.status(500).json({ message: "Error updating user", error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error verifying email", error: err });
    });
};

const resendVerificationCode = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      user.verificationToken = verificationToken;

      user
        .save()
        .then(() => {
          sendVerificationEmail(email, verificationToken);

          res.status(200).json({
            message: "New verification code sent to your email",
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Error updating verification code", error: err });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error resending verification code", error: err });
    });
};

const logout = (req, res) => {
  res.setHeader("Authorization", "");
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { signup, login, logout, verifyEmail, resendVerificationCode };
