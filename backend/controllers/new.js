const News = require("../models/news");

// Create a new news article (Admin only)
const addNews = async (req, res) => {
  try {
    const { title, content, author, source, image, url, category } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({
        message: "Title, content, and author are required",
      });
    }

    const newNews = new News({
      title,
      content,
      author,
      source,
      image,
      url,
      category,
    });

    const savedNews = await newNews.save();

    res.status(201).json({
      message: "News article created successfully",
      news: savedNews,
    });
  } catch (error) {
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
    const { id } = req.params;
    const { title, content, author, source, image, url, category } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        source,
        image,
        url,
        category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News article not found" });
    }

    res.status(200).json({
      message: "News article updated successfully",
      news: updatedNews,
    });
  } catch (error) {
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

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: "News article not found" });
    }

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

module.exports = {
  addNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getLatestNews,
};
