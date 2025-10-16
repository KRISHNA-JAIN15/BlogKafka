const News = require("../models/news");
const {
  deleteFromCloudinary,
  extractPublicId,
  hasCloudinaryConfig,
  getCurrentCloudinaryConfig,
  uploadToCloudinary,
} = require("../utils/cloudinary");

// Create a new news article (Admin only)
const addNews = async (req, res) => {
  try {
    console.log("📝 addNews - Request received");
    console.log("📋 Request body:", req.body);
    console.log("📎 Request file:", req.file);
    console.log("🔧 hasCloudinaryConfig:", hasCloudinaryConfig);

    const { title, content, author, source, url, category, featured } =
      req.body;

    // Validation
    if (!title || !content || !author) {
      console.log("❌ Validation failed: Missing required fields");
      return res.status(400).json({
        message: "Title, content, and author are required",
      });
    }

    // Get image URL from uploaded file (if any)
    let image = null;
    if (req.file) {
      console.log("📸 File uploaded successfully:");
      console.log("  - Original name:", req.file.originalname);
      console.log("  - Mimetype:", req.file.mimetype);
      console.log("  - Size:", req.file.size);
      console.log("  - Has path (Cloudinary):", !!req.file.path);
      console.log("  - Has buffer (Memory):", !!req.file.buffer);

      const currentConfig = getCurrentCloudinaryConfig();
      console.log("🔧 Current Cloudinary config status:", currentConfig);

      if (currentConfig) {
        if (req.file.path) {
          // File was uploaded to Cloudinary via multer storage
          image = req.file.path;
          console.log("☁️ Using Cloudinary URL from multer:", image);
        } else if (req.file.buffer) {
          // File is in memory, upload manually to Cloudinary
          console.log("📤 Manually uploading to Cloudinary...");
          try {
            const result = await uploadToCloudinary(req.file.buffer);
            image = result.secure_url;
            console.log("✅ Manual Cloudinary upload successful:", image);
          } catch (uploadError) {
            console.error("❌ Manual Cloudinary upload failed:", uploadError);
            image = null;
          }
        }
      } else {
        // If no Cloudinary, you could save to local storage or use a placeholder
        console.warn("⚠️ File uploaded but Cloudinary not configured");
        image = null; // or implement local file storage
      }
    } else {
      console.log("📷 No file uploaded in request");
    }

    console.log("💾 Creating news with image:", image);

    const newNews = new News({
      title,
      content,
      author,
      source,
      image,
      url,
      category,
      featured: featured === "true" || featured === true,
    });

    const savedNews = await newNews.save();
    console.log("✅ News saved successfully with ID:", savedNews._id);
    console.log("🖼️ Saved image URL:", savedNews.image);

    res.status(201).json({
      message: "News article created successfully",
      news: savedNews,
    });
  } catch (error) {
    console.error("❌ Error in addNews:", error);
    res.status(500).json({
      message: "Error creating news article",
      error: error.message,
    });
  }
};

// Get all news articles (Public)
const getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "News articles retrieved successfully",
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalNews: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news articles",
      error: error.message,
    });
  }
};

// Get single news article by ID (Public)
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }

    res.status(200).json({
      message: "News article retrieved successfully",
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news article",
      error: error.message,
    });
  }
};

// Update news article (Admin only)
const updateNews = async (req, res) => {
  try {
    console.log("📝 updateNews - Request received");
    console.log("📋 Request body:", req.body);
    console.log("📎 Request file:", req.file);

    const { id } = req.params;
    const { title, content, author, source, url, category, featured } =
      req.body;

    // Find the existing news article
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return res.status(404).json({ message: "News article not found" });
    }

    console.log("📰 Existing news image:", existingNews.image);

    // Prepare update data
    const updateData = {
      title,
      content,
      author,
      source,
      url,
      category,
      featured: featured === "true" || featured === true,
    };

    // Handle image update
    if (req.file) {
      console.log("📸 New file uploaded for update:");
      console.log("  - Original name:", req.file.originalname);
      console.log("  - Mimetype:", req.file.mimetype);
      console.log("  - Size:", req.file.size);
      console.log("  - Has path (Cloudinary):", !!req.file.path);
      console.log("  - Has buffer (Memory):", !!req.file.buffer);

      // Delete old image from Cloudinary if it exists and Cloudinary is configured
      if (existingNews.image && hasCloudinaryConfig) {
        const publicId = extractPublicId(existingNews.image);
        if (publicId) {
          try {
            console.log(
              "🗑️ Attempting to delete old image with publicId:",
              publicId
            );
            await deleteFromCloudinary(`news-app/${publicId}`);
            console.log("✅ Old image deleted successfully");
          } catch (error) {
            console.error("❌ Error deleting old image:", error);
            // Continue with update even if image deletion fails
          }
        }
      }

      // Set new image URL
      const currentConfig = getCurrentCloudinaryConfig();
      console.log("🔧 Current Cloudinary config status:", currentConfig);

      if (currentConfig) {
        if (req.file.path) {
          // File was uploaded to Cloudinary via multer storage
          updateData.image = req.file.path;
          console.log("☁️ Using Cloudinary URL from multer:", updateData.image);
        } else if (req.file.buffer) {
          // File is in memory, upload manually to Cloudinary
          console.log("📤 Manually uploading to Cloudinary...");
          try {
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.image = result.secure_url;
            console.log(
              "✅ Manual Cloudinary upload successful:",
              updateData.image
            );
          } catch (uploadError) {
            console.error("❌ Manual Cloudinary upload failed:", uploadError);
            updateData.image = null;
          }
        }
      } else {
        console.warn("⚠️ File uploaded but Cloudinary not configured");
        updateData.image = null; // or implement local file storage
      }
    } else {
      console.log("📷 No new file uploaded for update");
    }

    console.log("💾 Updating news with data:", updateData);

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("✅ News updated successfully");
    console.log("🖼️ Final image URL:", updatedNews.image);

    res.status(200).json({
      message: "News article updated successfully",
      news: updatedNews,
    });
  } catch (error) {
    console.error("❌ Error in updateNews:", error);
    res.status(500).json({
      message: "Error updating news article",
      error: error.message,
    });
  }
};

// Delete news article (Admin only)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const newsToDelete = await News.findById(id);
    if (!newsToDelete) {
      return res.status(404).json({ message: "News article not found" });
    }

    // Delete image from Cloudinary if it exists and Cloudinary is configured
    if (newsToDelete.image && hasCloudinaryConfig) {
      const publicId = extractPublicId(newsToDelete.image);
      if (publicId) {
        try {
          await deleteFromCloudinary(`news-app/${publicId}`);
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue with deletion even if image deletion fails
        }
      }
    }

    const deletedNews = await News.findByIdAndDelete(id);

    res.status(200).json({
      message: "News article deleted successfully",
      deletedNews: {
        id: deletedNews._id,
        title: deletedNews.title,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting news article",
      error: error.message,
    });
  }
};

// Get news by category (Public)
const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const news = await News.find({ category })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({ category });

    res.status(200).json({
      message: `News articles in ${category} category retrieved successfully`,
      news,
      category,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNews: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news by category",
      error: error.message,
    });
  }
};

// Get latest news (Public)
const getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const news = await News.find().sort({ publishedAt: -1 }).limit(limit);

    res.status(200).json({
      message: "Latest news articles retrieved successfully",
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching latest news",
      error: error.message,
    });
  }
};

// Get featured news (Public)
const getFeaturedNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const news = await News.find({ featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.status(200).json({
      message: "Featured news articles retrieved successfully",
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching featured news",
      error: error.message,
    });
  }
};

module.exports = {
  addNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getLatestNews,
  getFeaturedNews,
};
