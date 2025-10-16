import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#06b6d4",
      light: "#67e8f9",
      dark: "#0891b2",
    },
    background: {
      default: "linear-gradient(135deg, #1a1428 0%, #2d1b69 100%)",
      paper: "rgba(26, 20, 40, 0.85)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#c0c4fc",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontFamily: '"Orbitron", sans-serif' },
    h2: { fontFamily: '"Orbitron", sans-serif' },
    h3: { fontFamily: '"Orbitron", sans-serif' },
    h4: { fontFamily: '"Orbitron", sans-serif' },
    h5: { fontFamily: '"Orbitron", sans-serif' },
    h6: { fontFamily: '"Orbitron", sans-serif' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": [
          "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')",
          "url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap')",
        ],
      },
    },
  },
});

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch article by ID from API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/news/${id}`
        );
        setArticle(response.data.news);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        if (err.response && err.response.status === 404) {
          setError("Article not found");
        } else {
          setError("Failed to load article");
        }
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(26, 20, 40, 0.8)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(15px)",
            }}
          >
            <Typography variant="h5" sx={{ color: "#8b5cf6", mb: 2 }}>
              Loading article...
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  if (error || !article) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(26, 20, 40, 0.8)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(15px)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#ef4444",
                fontFamily: '"Orbitron", sans-serif',
                mb: 2,
              }}
            >
              {error || "Article Not Found"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#c0c4fc", mb: 3 }}>
              {error === "Article not found"
                ? "The article you're looking for doesn't exist or has been removed."
                : "There was an error loading the article. Please try again later."}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/news")}
              sx={{ mt: 2 }}
            >
              Back to News
            </Button>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 150) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd make an API call here
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you'd make an API call here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a1428 0%, #2d1b69 100%)",
        }}
      >
        <Navbar />

        <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "#8b5cf6",
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          {/* Article Content */}
          <Paper
            sx={{
              p: 4,
              background: "rgba(26, 20, 40, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "16px",
              backdropFilter: "blur(15px)",
            }}
          >
            {/* Article Header */}
            <Box sx={{ mb: 4 }}>
              {/* Category and Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Chip
                  label={article.category || "General"}
                  sx={{
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Box>
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} sx={{ color: "#c0c4fc" }}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                  >
                    <IconButton
                      onClick={toggleBookmark}
                      sx={{ color: "#c0c4fc" }}
                    >
                      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isLiked ? "Unlike" : "Like"}>
                    <IconButton onClick={toggleLike} sx={{ color: "#c0c4fc" }}>
                      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                {article.title}
              </Typography>

              {/* Meta Information */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      {article.author}
                    </Typography>
                    {article.source && (
                      <Typography variant="caption" sx={{ color: "#c0c4fc" }}>
                        {article.source}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TimeIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#c0c4fc" }}>
                    {formatDate(article.publishedAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: "rgba(139, 92, 246, 0.3)" }} />

            {/* Article Image */}
            {article.image && (
              <Box sx={{ mb: 4 }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Box>
            )}

            {/* Article Content */}
            <Typography
              variant="body1"
              sx={{
                color: "#e2e8f0",
                lineHeight: 1.8,
                fontSize: "1.1rem",
                "& p": { mb: 2 },
              }}
            >
              {article.content.split("\n").map((paragraph, index) => (
                <Box key={index} component="p" sx={{ mb: 2 }}>
                  {paragraph}
                </Box>
              ))}
            </Typography>

            {/* Article Footer */}
            {article.url && (
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid rgba(139, 92, 246, 0.3)",
                }}
              >
                <Typography variant="body2" sx={{ color: "#c0c4fc", mb: 1 }}>
                  Original source:
                </Typography>
                <Button
                  variant="outlined"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: "#8b5cf6",
                    color: "#8b5cf6",
                    "&:hover": {
                      borderColor: "#06b6d4",
                      color: "#06b6d4",
                    },
                  }}
                >
                  Read Original Article
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ArticleDetail;
