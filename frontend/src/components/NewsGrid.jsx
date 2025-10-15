import React, { useState, useEffect } from "react";
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
  Skeleton,
  Alert,
  Fab,
  Zoom,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import NewsCard from "./NewsCard";

// Sample news data - replace with actual API call
const SAMPLE_NEWS = [
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
    category: "Technology",
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
    category: "Politics",
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
    category: "Science",
  },
  {
    _id: "4",
    title: "Major Sports Championship Finals Draw Record Viewers",
    content:
      "The championship finals attracted over 100 million viewers worldwide, making it the most-watched sporting event of the year. The thrilling match went into overtime and featured spectacular performances from both teams.",
    author: "Jake Morrison",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: "Sports Central",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=345&h=200&fit=crop",
    url: "https://example.com/sports-championship",
    category: "Sports",
  },
  {
    _id: "5",
    title: "New Business Innovation Hub Opens Downtown",
    content:
      "A state-of-the-art innovation hub designed to foster entrepreneurship and technological advancement has opened its doors. The facility will house over 200 startups and provide resources for emerging businesses in the technology sector.",
    author: "Lisa Park",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Business Weekly",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=345&h=200&fit=crop",
    url: "https://example.com/innovation-hub",
    category: "Business",
  },
  {
    _id: "6",
    title: "Revolutionary Treatment Shows Promise for Rare Disease",
    content:
      "Clinical trials for a new gene therapy treatment have shown remarkable results in treating a rare genetic disorder. Patients in the trial experienced significant improvements in their condition, offering hope for thousands of affected individuals worldwide.",
    author: "Dr. Amanda Wilson",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Medical Journal",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=345&h=200&fit=crop",
    url: "https://example.com/gene-therapy",
    category: "Health",
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
    "technology",
    "politics",
    "science",
    "sports",
    "business",
    "health",
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Replace this with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setNews(SAMPLE_NEWS);
        setFilteredNews(SAMPLE_NEWS);
      } catch (error) {
        setError("Failed to fetch news");
        console.error("Error fetching news:", error);
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

  const renderSkeletonCards = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Box sx={{ pt: 2 }}>
            <Skeleton width="60%" />
            <Skeleton />
            <Skeleton width="80%" />
          </Box>
        </Paper>
      </Grid>
    ));

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Latest News
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Stay updated with the latest headlines and stories
        </Typography>
      </Box>

      {/* Search and Filter Controls */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
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
                  color={selectedCategory === category ? "primary" : "default"}
                  variant={
                    selectedCategory === category ? "filled" : "outlined"
                  }
                  sx={{ textTransform: "capitalize" }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* News Results Count */}
      {!loading && (
        <Typography variant="body1" color="text.secondary" mb={3}>
          Showing {filteredNews.length} news{" "}
          {filteredNews.length === 1 ? "article" : "articles"}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </Typography>
      )}

      {/* News Grid */}
      <Grid container spacing={3}>
        {loading ? (
          renderSkeletonCards()
        ) : filteredNews.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No news articles found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Try adjusting your search terms or filters
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
