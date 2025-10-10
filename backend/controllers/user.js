const mongoose = require("mongoose");
const User = require("../models/user");
const { generateToken } = require("../utils/JsonWebToken");

const signup = (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User({ username, email, password });
      newUser
        .save()
        .then((user) => {
          res.status(201).json({ message: "User created successfully", user });
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
        return res.status(400).json({ message: "User Not in Database" });
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
          });
          res.setHeader("Authorization", `Bearer ${token}`);
          res.status(200).json({ message: "Login successful", user, token });
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

const logout = (req, res) => {
  res.setHeader("Authorization", "");
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { signup, login, logout };
