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
        setError("Failed to fetch news from server. Please try again later.");
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

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedCategory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getResultsText = () => {
    if (loading) return "Loading...";
    if (error) return "Error loading news";

    const totalResults = filteredNews.length;
    const totalNews = news.length;

    if (searchTerm || selectedCategory !== "all") {
      return `${totalResults} result${totalResults !== 1 ? "s" : ""} found${
        searchTerm ? ` for "${searchTerm}"` : ""
      }${selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}`;
    }

    return `${totalNews} article${totalNews !== 1 ? "s" : ""} available`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
        >
          <CircularProgress
            size={60}
            sx={{
              color: "#8b5cf6",
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#8b5cf6",
              fontFamily: '"Orbitron", sans-serif',
              textAlign: "center",
            }}
          >
            Loading news articles...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: "bold",
            background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            textShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
          }}
        >
          Latest News
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#c0c4fc",
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {getResultsText()}
        </Typography>
      </Box>

      {/* Search and Filter Controls */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: "rgba(26, 20, 40, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139, 92, 246, 0.4)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
        }}
      >
        <Grid container spacing={3} alignItems="flex-end">
          {/* Search Bar */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search news articles..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#8b5cf6", fontSize: 24 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  background: "rgba(139, 92, 246, 0.08)",
                  height: "56px",
                  fontSize: "1.1rem",
                  "& fieldset": {
                    borderColor: "rgba(139, 92, 246, 0.3)",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(139, 92, 246, 0.6)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                    boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.1)",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  padding: "16px 14px",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#c0c4fc",
                  opacity: 0.8,
                  fontSize: "1.1rem",
                },
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#8b5cf6",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <FilterIcon sx={{ fontSize: 20 }} />
                Filter by Category
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category === "all" ? "All" : category}
                    onClick={() => handleCategoryFilter(category)}
                    variant={
                      selectedCategory === category ? "filled" : "outlined"
                    }
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: '"Orbitron", sans-serif',
                      fontWeight:
                        selectedCategory === category ? "bold" : "normal",
                      fontSize: "0.85rem",
                      height: "36px",
                      cursor: "pointer",
                      mb: 1,
                      borderRadius: "18px",
                      background:
                        selectedCategory === category
                          ? "linear-gradient(45deg, #8b5cf6, #06b6d4)"
                          : "rgba(139, 92, 246, 0.1)",
                      color: selectedCategory === category ? "#fff" : "#8b5cf6",
                      border:
                        selectedCategory === category
                          ? "none"
                          : "2px solid rgba(139, 92, 246, 0.3)",
                      "&:hover": {
                        background:
                          selectedCategory === category
                            ? "linear-gradient(45deg, #a78bfa, #67e8f9)"
                            : "rgba(139, 92, 246, 0.2)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ffffff",
            "& .MuiAlert-icon": {
              color: "#ef4444",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && filteredNews.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: "rgba(26, 20, 40, 0.85)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#8b5cf6",
              mb: 2,
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            {news.length === 0 ? "No Articles Available" : "No Results Found"}
          </Typography>
          <Typography variant="body1" sx={{ color: "#c0c4fc", mb: 3 }}>
            {news.length === 0
              ? "There are no news articles in the database yet. Please check back later or contact an administrator to add content."
              : searchTerm || selectedCategory !== "all"
              ? `No articles match your current search criteria. Try adjusting your search term or category filter.`
              : "No articles to display."}
          </Typography>
          {(searchTerm || selectedCategory !== "all") && (
            <Box>
              <Chip
                label="Clear Filters"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                sx={{
                  background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                  color: "#fff",
                  fontFamily: '"Orbitron", sans-serif',
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </Paper>
      )}

      {/* News Grid */}
      {!loading && !error && filteredNews.length > 0 && (
        <Grid container spacing={3}>
          {filteredNews.map((article) => (
            <Grid item xs={12} sm={6} lg={4} key={article._id}>
              <NewsCard
                news={article}
                isBookmarked={bookmarkedNews.has(article._id)}
                isLiked={likedNews.has(article._id)}
                onBookmark={() => handleBookmark(article._id)}
                onLike={() => handleLike(article._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
            "&:hover": {
              background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
              boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default NewsGrid;
