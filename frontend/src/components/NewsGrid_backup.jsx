import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Paper,
  Alert,
  Fab,
  Zoom,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import NewsCard from "./NewsCard";

// Suppress MUI Grid deprecation warnings
const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
  if (typeof message === "string" && message.includes("MUI Grid:")) {
    return;
  }
  originalConsoleWarn(message, ...args);
};

const NewsGrid = () => {
  {
    _id: "1",
    title: "Revolutionary AI Technology Transforms Healthcare Industry",
    content:
      "A groundbreaking artificial intelligence system has been developed that can diagnose diseases with 99% accuracy. This technology represents a significant leap forward in medical diagnostics and could revolutionize how we approach healthcare in the future. The system uses advanced machine learning algorithms trained on millions of medical images and patient records.",
    author: "Dr. Sarah Johnson",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "TechHealth Today",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=345&h=200&fit=crop",
    url: "https://example.com/ai-healthcare",
    category: "Tech and Innovation",
  },
  {
    _id: "2",
    title: "Global Climate Summit Reaches Historic Agreement",
    content:
      "World leaders have signed a comprehensive climate agreement that sets ambitious targets for carbon reduction. The agreement includes commitments from over 190 countries to achieve net-zero emissions by 2050. This historic moment marks a turning point in global climate action.",
    author: "Michael Chen",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: "Global News Network",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=345&h=200&fit=crop",
    url: "https://example.com/climate-summit",
    category: "World and Politics",
  },
  {
    _id: "3",
    title: "Breakthrough in Quantum Computing Achieved",
    content:
      "Scientists have successfully demonstrated quantum supremacy with a new quantum computer that can solve complex problems exponentially faster than traditional computers. This achievement opens up new possibilities for cryptography, drug discovery, and artificial intelligence.",
    author: "Dr. Emily Rodriguez",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "Quantum Today",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=345&h=200&fit=crop",
    url: "https://example.com/quantum-computing",
    category: "Tech and Innovation",
  },
  {
    _id: "4",
    title: "Global Cryptocurrency Market Reaches New Heights",
    content:
      "The cryptocurrency market has surged to unprecedented levels, with Bitcoin reaching new all-time highs. Financial experts analyze the factors driving this growth and what it means for traditional banking systems and investment strategies.",
    author: "Jake Morrison",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: "Crypto Finance",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=345&h=200&fit=crop",
    url: "https://example.com/crypto-surge",
    category: "Finance and Money",
  },
  {
    _id: "5",
    title: "Federal Reserve Announces Interest Rate Changes",
    content:
      "The Federal Reserve has announced significant changes to interest rates in response to current economic conditions. This decision will impact mortgage rates, business loans, and investment strategies across multiple sectors.",
    author: "Lisa Park",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Financial Times",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=345&h=200&fit=crop",
    url: "https://example.com/fed-rates",
    category: "Finance and Money",
  },
  {
    _id: "6",
    title: "UN Security Council Addresses Global Peace Initiative",
    content:
      "The United Nations Security Council has convened to discuss a comprehensive global peace initiative aimed at resolving ongoing international conflicts. The proposal includes diplomatic frameworks and peacekeeping strategies for multiple regions worldwide.",
    author: "Dr. Amanda Wilson",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Global Affairs Today",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0d7e19a9b14?w=345&h=200&fit=crop",
    url: "https://example.com/un-peace-initiative",
    category: "World and Politics",
  },
];

const NewsGrid = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedNews, setBookmarkedNews] = useState(new Set());
  const [likedNews, setLikedNews] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = [
    "all",
    "tech and innovation",
    "finance and money",
    "world and politics",
  ];

  useEffect(() => {
    // Fetch news from API
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/news?limit=50`
        );
        
        const newsData = response.data.news || [];
        setNews(newsData);
        setFilteredNews(newsData);
        setError("");
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news from server");
        // Set empty arrays so we don't show static data
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedCategory, news]);

  const handleBookmark = (newsId) => {
    setBookmarkedNews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleLike = (newsId) => {
    setLikedNews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(newsId)) {
        newSet.delete(newsId);
      } else {
        newSet.add(newsId);
      }
      return newSet;
    });
  };

  const handleShare = async (newsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.content.substring(0, 100) + "...",
          url: newsItem.url || window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(newsItem.url || window.location.href);
      // You could show a toast notification here
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            background: "rgba(255, 23, 68, 0.1)",
            border: "1px solid rgba(255, 23, 68, 0.3)",
            color: "#ff1744",
            borderRadius: "12px",
            "& .MuiAlert-icon": {
              color: "#ff1744",
            },
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Search and Filter Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: "rgba(20, 25, 45, 0.8)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(0, 255, 255, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 255, 255, 0.1)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search the matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  fontFamily: '"Orbitron", sans-serif',
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 255, 255, 0.6)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ffff",
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#b0bec5",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#00ffff" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  onClick={() => setSelectedCategory(category)}
                  variant={
                    selectedCategory === category ? "filled" : "outlined"
                  }
                  sx={{
                    textTransform: "capitalize",
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    border:
                      selectedCategory === category
                        ? "none"
                        : "1px solid rgba(0, 255, 255, 0.3)",
                    background:
                      selectedCategory === category
                        ? "linear-gradient(45deg, #00ffff, #ff0080)"
                        : "rgba(0, 255, 255, 0.1)",
                    color: selectedCategory === category ? "#000" : "#00ffff",
                    "&:hover": {
                      background:
                        selectedCategory === category
                          ? "linear-gradient(45deg, #64ffda, #ff4081)"
                          : "rgba(0, 255, 255, 0.2)",
                      boxShadow: "0 0 15px rgba(0, 255, 255, 0.4)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* News Results Count */}
      {!loading && (
        <Typography
          variant="body1"
          mb={3}
          sx={{
            color: "#b0bec5",
            fontFamily: '"Orbitron", sans-serif',
            textAlign: "center",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
          }}
        >
          ⚡ {filteredNews.length} news found
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory} sector`}
        </Typography>
      )}

      {/* News Grid */}
      <Grid container spacing={3} ml={4}>
        {loading ? (
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                minHeight: "400px",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                }}
              >
                <CircularProgress
                  size={80}
                  thickness={3}
                  sx={{
                    color: "#00ffff",
                    filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))",
                    animation: "spin 2s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    color: "#ff0080",
                    position: "absolute",
                    top: 10,
                    left: 10,
                    filter: "drop-shadow(0 0 15px rgba(255, 0, 128, 0.6))",
                    animation: "spin-reverse 1.5s linear infinite",
                    "@keyframes spin-reverse": {
                      "0%": { transform: "rotate(360deg)" },
                      "100%": { transform: "rotate(0deg)" },
                    },
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mr: 150,
                  color: "#00ffff",
                  fontFamily: '"Orbitron", sans-serif',
                  textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.7 },
                    "100%": { opacity: 1 },
                  },
                }}
              ></Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  mr: 150,
                  color: "#b0bec5",
                  fontFamily: '"Orbitron", sans-serif',
                }}
              ></Typography>
            </Box>
          </Grid>
        ) : filteredNews.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                background: "rgba(20, 25, 45, 0.8)",
                border: "1px solid rgba(255, 0, 128, 0.3)",
                borderRadius: "16px",
                backdropFilter: "blur(15px)",
                boxShadow: "0 8px 32px rgba(255, 0, 128, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#ff0080",
                  fontFamily: '"Orbitron", sans-serif',
                  textShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
                  mb: 1,
                }}
              >
                ⚠️ NO TRANSMISSIONS FOUND ⚠️
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#b0bec5",
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                Try adjusting your search parameters or filters
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredNews.map((newsItem) => (
            <Grid item xs={12} sm={6} lg={4} key={newsItem._id}>
              <NewsCard
                news={newsItem}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onLike={handleLike}
                isBookmarked={bookmarkedNews.has(newsItem._id)}
                isLiked={likedNews.has(newsItem._id)}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default NewsGrid;
