import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  IconButton,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Interests as InterestsIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

const availableTopics = [
  "Tech and Innovation",
  "Finance and Money",
  "World and Politics",
  "Sports",
  "Entertainment",
  "Health and Fitness",
  "Business and Finance",
  "Science and Environment",
  "Food and Travel",
];

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    topicsOfInterest: [],
    profilePicture: "",
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access your profile");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data.user;
        setProfile({
          username: userData.username || "",
          email: userData.email || "",
          bio: userData.bio || "",
          topicsOfInterest: userData.topicsOfInterest || [],
          profilePicture: userData.profilePicture || "",
        });
        setOriginalProfile({
          username: userData.username || "",
          email: userData.email || "",
          bio: userData.bio || "",
          topicsOfInterest: userData.topicsOfInterest || [],
          profilePicture: userData.profilePicture || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        } else {
          setError("Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, navigate]);

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("bio", profile.bio);
      formData.append(
        "topicsOfInterest",
        JSON.stringify(profile.topicsOfInterest)
      );

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local storage with new token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Profile updated successfully!");

      // Update the original profile state
      setOriginalProfile({
        ...profile,
        profilePicture: response.data.user.profilePicture,
      });

      // Clear file selection
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed successfully!");
      setChangePasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    }
  };

  const resetChanges = () => {
    setProfile({ ...originalProfile });
    setSelectedFile(null);
    setPreview("");
    setError("");
  };

  const hasChanges = () => {
    return (
      profile.username !== originalProfile.username ||
      profile.bio !== originalProfile.bio ||
      JSON.stringify(profile.topicsOfInterest) !==
        JSON.stringify(originalProfile.topicsOfInterest) ||
      selectedFile !== null
    );
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} sx={{ color: "#8b5cf6" }} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, mt: 8 }}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            background:
              "linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 20, 40, 0.98) 100%)",
            backdropFilter: "blur(30px)",
            border: "2px solid rgba(139, 92, 246, 0.4)",
            borderRadius: "24px",
            boxShadow:
              "0 25px 50px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), transparent)",
            },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: "bold",
                background:
                  "linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: "0.5px",
              }}
            >
              Profile Settings
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(192, 196, 252, 0.9)",
                maxWidth: 700,
                mx: "auto",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Customize your account and personalize your experience
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1: Profile Picture + Name/Email Fields */}
            <Box
              sx={{
                display: "flex",
                gap: 4,
                mb: 4,
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              {/* Profile Picture Container */}
              <Box
                sx={{
                  flex: "0 0 auto",
                  width: { xs: "100%", md: "350px" },
                  textAlign: "center",
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "2px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#8b5cf6",
                    mb: 3,
                    fontFamily: '"Orbitron", sans-serif',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    fontWeight: 600,
                  }}
                >
                  <PersonIcon />
                  Profile Picture
                </Typography>

                <Box
                  {...getRootProps()}
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    cursor: "pointer",
                    mb: 3,
                    p: 3,
                    borderRadius: "50%",
                    background: isDragActive
                      ? "rgba(139, 92, 246, 0.25)"
                      : "rgba(139, 92, 246, 0.12)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(139, 92, 246, 0.25)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <Avatar
                    src={preview || profile.profilePicture}
                    sx={{
                      width: 180,
                      height: 180,
                      mx: "auto",
                      border: "4px solid rgba(139, 92, 246, 0.5)",
                      transition: "all 0.3s ease",
                      boxShadow: "0 12px 30px rgba(139, 92, 246, 0.4)",
                      "&:hover": {
                        border: "4px solid rgba(139, 92, 246, 0.8)",
                        boxShadow: "0 16px 40px rgba(139, 92, 246, 0.6)",
                      },
                    }}
                  >
                    {!preview && !profile.profilePicture && (
                      <PersonIcon sx={{ fontSize: 90, color: "#8b5cf6" }} />
                    )}
                  </Avatar>

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                      color: "white",
                      width: 56,
                      height: 56,
                      boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#c0c4fc",
                    display: "block",
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {isDragActive
                    ? "Drop image here..."
                    : "Click or drag to upload"}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(192, 196, 252, 0.7)",
                    display: "block",
                    mb: 2,
                  }}
                >
                  JPG, PNG, WEBP (Max 5MB)
                </Typography>

                {selectedFile && (
                  <Chip
                    label={selectedFile.name}
                    onDelete={() => {
                      setSelectedFile(null);
                      setPreview("");
                    }}
                    sx={{
                      mt: 1,
                      background: "rgba(139, 92, 246, 0.3)",
                      color: "#ffffff",
                      "& .MuiChip-deleteIcon": {
                        color: "#ffffff",
                      },
                    }}
                  />
                )}
              </Box>

              {/* Name and Email Container */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "2px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)",
                  minHeight: "400px",
                  justifyContent: "center",
                }}
              >
                {/* Username Field */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#8b5cf6",
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon />
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    value={profile.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    required
                    placeholder="Enter your username"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        background: "rgba(139, 92, 246, 0.1)",
                        fontSize: "18px",
                        height: "60px",
                        "& fieldset": {
                          borderColor: "rgba(139, 92, 246, 0.4)",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(139, 92, 246, 0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#8b5cf6",
                          borderWidth: "3px",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>

                {/* Email Field */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#8b5cf6",
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EmailIcon />
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    value={profile.email}
                    disabled
                    placeholder="Your email address"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        background: "rgba(139, 92, 246, 0.15)",
                        fontSize: "18px",
                        height: "60px",
                        "& fieldset": {
                          borderColor: "rgba(139, 92, 246, 0.5)",
                          borderWidth: "2px",
                        },
                        "&.Mui-disabled": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.4)",
                          },
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#ffffff !important",
                        fontSize: "18px",
                        fontWeight: 500,
                        "-webkit-text-fill-color": "#ffffff !important",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Row 2: Bio Section - Full Width */}
            <Box
              sx={{
                mb: 4,
                p: 4,
                borderRadius: "20px",
                background: "rgba(139, 92, 246, 0.08)",
                border: "2px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#8b5cf6",
                  mb: 3,
                  fontFamily: '"Orbitron", sans-serif',
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <InfoIcon />
                Bio / About Me
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself, your interests, background, or anything you'd like to share..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "rgba(139, 92, 246, 0.1)",
                    "& fieldset": {
                      borderColor: "rgba(139, 92, 246, 0.4)",
                      borderWidth: "2px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(139, 92, 246, 0.7)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                      borderWidth: "3px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontWeight: 400,
                  },
                }}
              />
            </Box>

            {/* Row 3: Topics of Interest - Full Width */}
            <Box
              sx={{
                mb: 4,
                p: 4,
                borderRadius: "20px",
                background: "rgba(139, 92, 246, 0.08)",
                border: "2px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#8b5cf6",
                  mb: 2,
                  fontFamily: '"Orbitron", sans-serif',
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <InterestsIcon />
                Topics of Interest
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(192, 196, 252, 0.8)",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Select topics you're interested in to personalize your news feed
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 3,
                  mb: 3,
                }}
              >
                {availableTopics.map((topic) => (
                  <Box
                    key={topic}
                    onClick={() => {
                      const isSelected =
                        profile.topicsOfInterest.includes(topic);
                      if (isSelected) {
                        setProfile((prev) => ({
                          ...prev,
                          topicsOfInterest: prev.topicsOfInterest.filter(
                            (t) => t !== topic
                          ),
                        }));
                      } else {
                        setProfile((prev) => ({
                          ...prev,
                          topicsOfInterest: [...prev.topicsOfInterest, topic],
                        }));
                      }
                    }}
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      background: profile.topicsOfInterest.includes(topic)
                        ? "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4))"
                        : "rgba(139, 92, 246, 0.12)",
                      border: profile.topicsOfInterest.includes(topic)
                        ? "2px solid rgba(139, 92, 246, 0.8)"
                        : "2px solid rgba(139, 92, 246, 0.3)",
                      transform: profile.topicsOfInterest.includes(topic)
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      boxShadow: profile.topicsOfInterest.includes(topic)
                        ? "0 8px 25px rgba(139, 92, 246, 0.4)"
                        : "0 4px 15px rgba(139, 92, 246, 0.2)",
                      "&:hover": {
                        background: profile.topicsOfInterest.includes(topic)
                          ? "linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5))"
                          : "rgba(139, 92, 246, 0.2)",
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 35px rgba(139, 92, 246, 0.5)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: profile.topicsOfInterest.includes(topic)
                          ? "#ffffff"
                          : "#c0c4fc",
                        fontWeight: profile.topicsOfInterest.includes(topic)
                          ? 700
                          : 500,
                        textAlign: "center",
                        fontSize: "16px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {topic}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Selected Topics Summary */}
              {profile.topicsOfInterest.length > 0 && (
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: "2px solid rgba(139, 92, 246, 0.3)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#c0c4fc",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    Selected Topics ({profile.topicsOfInterest.length}):
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {profile.topicsOfInterest.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        onDelete={() => {
                          setProfile((prev) => ({
                            ...prev,
                            topicsOfInterest: prev.topicsOfInterest.filter(
                              (t) => t !== topic
                            ),
                          }));
                        }}
                        sx={{
                          background:
                            "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 600,
                          height: "36px",
                          "& .MuiChip-deleteIcon": {
                            color: "#ffffff",
                            fontSize: "18px",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 6, borderColor: "rgba(139, 92, 246, 0.4)" }} />

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                p: 3,
                borderRadius: "16px",
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setChangePasswordDialog(true)}
                sx={{
                  borderRadius: "12px",
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  color: "#8b5cf6",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#8b5cf6",
                    background: "rgba(139, 92, 246, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
                  },
                }}
              >
                Change Password
              </Button>

              <Box sx={{ display: "flex", gap: 2 }}>
                {hasChanges() && (
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={resetChanges}
                    sx={{
                      borderRadius: "12px",
                      borderColor: "rgba(239, 68, 68, 0.5)",
                      color: "#ef4444",
                      padding: "12px 24px",
                      fontSize: "16px",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                      },
                    }}
                  >
                    Reset Changes
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={saving || !hasChanges()}
                  sx={{
                    borderRadius: "12px",
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                    fontFamily: '"Orbitron", sans-serif',
                    padding: "12px 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                    },
                    "&:disabled": {
                      background: "rgba(139, 92, 246, 0.3)",
                      transform: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background:
                "linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(26, 20, 40, 0.98) 100%)",
              backdropFilter: "blur(30px)",
              border: "2px solid rgba(139, 92, 246, 0.4)",
              borderRadius: "20px",
              boxShadow: "0 25px 50px rgba(139, 92, 246, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "#8b5cf6",
              fontFamily: '"Orbitron", sans-serif',
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              pb: 1,
            }}
          >
            Change Password
          </DialogTitle>
          <DialogContent sx={{ px: 4, py: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(192, 196, 252, 0.8)",
                textAlign: "center",
                mb: 4,
              }}
            >
              Enter your current password and choose a new secure password
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background: "rgba(139, 92, 246, 0.08)",
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.4)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.7)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#ffffff",
                      fontSize: "16px",
                      padding: "16px 14px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#c0c4fc",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#8b5cf6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background: "rgba(139, 92, 246, 0.08)",
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.4)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.7)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#ffffff",
                      fontSize: "16px",
                      padding: "16px 14px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#c0c4fc",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#8b5cf6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background: "rgba(139, 92, 246, 0.08)",
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.4)",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.7)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#ffffff",
                      fontSize: "16px",
                      padding: "16px 14px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#c0c4fc",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#8b5cf6",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4, pt: 2 }}>
            <Button
              onClick={() => setChangePasswordDialog(false)}
              sx={{
                color: "#c0c4fc",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "16px",
                "&:hover": {
                  background: "rgba(192, 196, 252, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                borderRadius: "12px",
                padding: "10px 24px",
                fontSize: "16px",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
                },
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default UpdateProfile;
