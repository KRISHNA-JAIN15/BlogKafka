import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";

const categories = [
  "Tech and Innovation",
  "Finance and Money",
  "World and Politics",
];

const AddEditNewsDialog = ({ open, onClose, newsItem, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    source: "",
    url: "",
    category: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when dialog opens or newsItem changes
  React.useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || "",
        content: newsItem.content || "",
        author: newsItem.author || "",
        source: newsItem.source || "",
        url: newsItem.url || "",
        category: newsItem.category || "",
        featured: newsItem.featured || false,
      });
      setPreview(newsItem.image || "");
    } else {
      setFormData({
        title: "",
        content: "",
        author: "",
        source: "",
        url: "",
        category: "",
        featured: false,
      });
      setPreview("");
    }
    setSelectedFile(null);
    setError("");
  }, [newsItem, open]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview("");
    if (newsItem) {
      // If editing, we'll need to handle image removal on the server
      setFormData((prev) => ({ ...prev, removeImage: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (
        !formData.title.trim() ||
        !formData.content.trim() ||
        !formData.author.trim()
      ) {
        setError("Title, content, and author are required fields");
        setLoading(false);
        return;
      }

      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("content", formData.content.trim());
      submitData.append("author", formData.author.trim());
      submitData.append("source", formData.source.trim());
      submitData.append("url", formData.url.trim());
      submitData.append("category", formData.category);
      submitData.append("featured", formData.featured);

      // Add image if selected
      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (newsItem) {
        // Update existing news
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/news/${newsItem._id}`,
          submitData,
          config
        );
        toast.success("News article updated successfully!");
      } else {
        // Create new news
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/news`,
          submitData,
          config
        );
        toast.success("News article created successfully!");
      }

      console.log("Response:", response.data);

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting news:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save news article";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(26, 20, 40, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        {newsItem ? "Edit News Article" : "Add New News Article"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
            variant="outlined"
          />

          {/* Content */}
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            multiline
            rows={6}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          {/* Author and Category Row */}
          <Box display="flex" gap={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Source and URL Row */}
          <Box display="flex" gap={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="URL"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              variant="outlined"
              type="url"
            />
          </Box>

          {/* Featured Checkbox */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  sx={{
                    color: "#8b5cf6",
                    "&.Mui-checked": {
                      color: "#8b5cf6",
                    },
                  }}
                />
              }
              label="Featured Story"
              sx={{
                color: "#e2e8f0",
                "& .MuiFormControlLabel-label": {
                  fontWeight: "bold",
                },
              }}
            />
          </Box>

          {/* Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: "#8b5cf6",
                fontWeight: "bold",
              }}
            >
              Article Image
            </Typography>

            {preview ? (
              <Paper
                sx={{
                  p: 2,
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: 100,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Box flexGrow={1}>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile ? selectedFile.name : "Current image"}
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    color="error"
                    size="small"
                  >
                    Remove
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper
                {...getRootProps()}
                sx={{
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragActive
                    ? "rgba(139, 92, 246, 0.2)"
                    : "rgba(139, 92, 246, 0.1)",
                  border: `2px dashed ${
                    isDragActive ? "#8b5cf6" : "rgba(139, 92, 246, 0.5)"
                  }`,
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(139, 92, 246, 0.2)",
                    borderColor: "#8b5cf6",
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon
                  sx={{
                    fontSize: 48,
                    color: "#8b5cf6",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, color: "#8b5cf6" }}>
                  {isDragActive
                    ? "Drop the image here"
                    : "Drag & drop an image here"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select a file (max 5MB)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPEG, PNG, GIF, WebP
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "#c0c4fc" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
              fontFamily: '"Orbitron", sans-serif',
              minWidth: 120,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : newsItem ? (
              "Update Article"
            ) : (
              "Create Article"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditNewsDialog;
