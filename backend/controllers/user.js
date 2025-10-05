const mongoose = require("mongoose");
const User = require("../models/user");

export const signup = (req, res) => {
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

export const login = (req, res) => {
  // Logic for user login
  res.send("User logged in");
};
