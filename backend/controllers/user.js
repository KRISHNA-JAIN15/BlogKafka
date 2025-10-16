const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/user");
const { generateToken } = require("../utils/JsonWebToken");
const { sendVerificationEmail, sendWelcomeEmail } = require("../utils/email");
const {
  uploadToCloudinary,
  getCurrentCloudinaryConfig,
} = require("../utils/cloudinary");

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

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        topicsOfInterest: user.topicsOfInterest,
        profilePicture: user.profilePicture,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    console.log("📝 updateProfile - Request received");
    console.log("📋 Request body:", req.body);
    console.log("📎 Request file:", req.file ? "File uploaded" : "No file");

    const { username, bio, topicsOfInterest } = req.body;
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update data
    const updateData = {};

    if (username && username.trim() !== "") {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      updateData.username = username.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim();
    }

    if (topicsOfInterest) {
      try {
        const topics = Array.isArray(topicsOfInterest)
          ? topicsOfInterest
          : JSON.parse(topicsOfInterest);
        updateData.topicsOfInterest = topics.filter(
          (topic) => topic.trim() !== ""
        );
      } catch (error) {
        return res.status(400).json({ message: "Invalid topics format" });
      }
    }

    // Handle profile picture upload
    if (req.file) {
      console.log("📸 Profile picture uploaded:");
      console.log("  - Original name:", req.file.originalname);
      console.log("  - Mimetype:", req.file.mimetype);
      console.log("  - Size:", req.file.size);

      const currentConfig = getCurrentCloudinaryConfig();
      console.log("🔧 Current Cloudinary config status:", currentConfig);

      if (currentConfig) {
        try {
          if (req.file.path) {
            // File was uploaded to Cloudinary via multer storage
            updateData.profilePicture = req.file.path;
            console.log(
              "☁️ Using Cloudinary URL from multer:",
              updateData.profilePicture
            );
          } else if (req.file.buffer) {
            // File is in memory, upload manually to Cloudinary
            console.log(
              "📤 Manually uploading profile picture to Cloudinary..."
            );
            const result = await uploadToCloudinary(req.file.buffer, {
              folder: "news-app/profiles",
              transformation: [
                {
                  width: 300,
                  height: 300,
                  crop: "fill",
                  gravity: "face",
                  quality: "auto",
                  fetch_format: "auto",
                },
              ],
            });
            updateData.profilePicture = result.secure_url;
            console.log(
              "✅ Manual Cloudinary upload successful:",
              updateData.profilePicture
            );
          }
        } catch (uploadError) {
          console.error("❌ Profile picture upload failed:", uploadError);
          return res.status(500).json({
            message: "Failed to upload profile picture",
            error: uploadError.message,
          });
        }
      } else {
        console.warn("⚠️ File uploaded but Cloudinary not configured");
        return res.status(500).json({
          message: "Image upload service not available",
        });
      }
    }

    console.log("💾 Updating user with data:", updateData);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    console.log("✅ Profile updated successfully");

    // Generate new token with updated user info
    const newToken = generateToken({
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        topicsOfInterest: updatedUser.topicsOfInterest,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      token: newToken,
    });
  } catch (error) {
    console.error("❌ Error in updateProfile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save hook to hash the password

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  getProfile,
  updateProfile,
  changePassword,
};
