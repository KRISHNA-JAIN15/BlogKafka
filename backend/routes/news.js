const express = require("express");
const router = express.Router();
const {
  addNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNewsByCategory,
  getLatestNews,
  getFeaturedNews,
} = require("../controllers/new");
const { checkAdmin } = require("../middleware/checkAuth");
const { upload } = require("../utils/cloudinary");

// Public routes
router.get("/", getAllNews); // GET /api/news
router.get("/latest", getLatestNews); // GET /api/news/latest
router.get("/featured", getFeaturedNews); // GET /api/news/featured
router.get("/category/:category", getNewsByCategory); // GET /api/news/category/tech
router.get("/:id", getNewsById); // GET /api/news/:id

// Admin-only routes with file upload
router.post("/", checkAdmin, upload.single("image"), addNews); // POST /api/news (Admin only)
router.put("/:id", checkAdmin, upload.single("image"), updateNews); // PUT /api/news/:id (Admin only)
router.delete("/:id", checkAdmin, deleteNews); // DELETE /api/news/:id (Admin only)

// Admin dashboard routes
router.get("/admin/test-auth", checkAdmin, async (req, res) => {
  console.log("🧪 Test auth endpoint hit");
  console.log("👤 User:", req.user);
  res.status(200).json({
    message: "Authentication successful",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

router.get("/admin/stats", checkAdmin, async (req, res) => {
  try {
    const News = require("../models/news");

    const totalNews = await News.countDocuments();
    const recentNews = await News.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const categoriesStats = await News.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      message: "News statistics retrieved successfully",
      stats: {
        totalNews,
        recentNews,
        categoriesStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news statistics",
      error: error.message,
    });
  }
});

module.exports = router;
