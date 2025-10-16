import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Fab,
  Zoom,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  Favorite as FavoriteIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import NewsCard from "./NewsCard";

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
    fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
    },
    h6: {
      fontWeight: 600,
      color: "#8b5cf6",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        body {
          background: linear-gradient(135deg, #1a1428 0%, #2d1b69 100%);
          min-height: 100vh;
          background-attachment: fixed;
        }
      `,
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`saved-tabpanel-${index}`}
      aria-labelledby={`saved-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const SavedNews = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedNews, setSavedNews] = useState([]);
  const [likedNews, setLikedNews] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to view your saved articles");
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top button logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch saved and liked news
  useEffect(() => {
    const fetchSavedNews = async () => {
      if (!isAuthenticated || !token) return;

      try {
        setLoading(true);
        setError("");

        // Fetch bookmarked news
        const bookmarkedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/bookmarks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch liked news
        const likedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/liked`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSavedNews(bookmarkedResponse.data.bookmarks || []);
        setLikedNews(likedResponse.data.liked || []);
      } catch (error) {
        console.error("Error fetching saved news:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/");
        } else {
          setError("Failed to load saved articles. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedNews();
  }, [isAuthenticated, token, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBookmark = async (newsId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/bookmark/${newsId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from saved news if unbookmarked
      setSavedNews((prev) => prev.filter((news) => news._id !== newsId));
      toast.success("Bookmark removed");
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleLike = async (newsId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/like/${newsId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from liked news if unliked
      setLikedNews((prev) => prev.filter((news) => news._id !== newsId));
      toast.success("Like removed");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 8, mt: 10 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
          >
            <CircularProgress size={60} sx={{ color: "#8b5cf6", mb: 3 }} />
            <Typography
              variant="h6"
              sx={{
                color: "#8b5cf6",
                fontFamily: '"Orbitron", sans-serif',
                textAlign: "center",
              }}
            >
              Loading your saved articles...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          mt: 10,
          background: "linear-gradient(135deg, #1a1428 0%, #2d1b69 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
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
              My Saved Articles
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
              Your bookmarked and liked articles in one place
            </Typography>
          </Box>

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

          {/* Tabs */}
          <Paper
            sx={{
              mb: 4,
              background: "rgba(26, 20, 40, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#8b5cf6",
                  height: "3px",
                  borderRadius: "2px",
                },
                "& .MuiTab-root": {
                  color: "#c0c4fc",
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  py: 3,
                  "&.Mui-selected": {
                    color: "#8b5cf6",
                  },
                  "&:hover": {
                    color: "#06b6d4",
                  },
                },
              }}
            >
              <Tab
                icon={<BookmarkIcon />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Bookmarked
                    <Chip
                      label={savedNews.length}
                      size="small"
                      sx={{
                        background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                }
                iconPosition="start"
              />
              <Tab
                icon={<FavoriteIcon />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Liked
                    <Chip
                      label={likedNews.length}
                      size="small"
                      sx={{
                        background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                }
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {savedNews.length === 0 ? (
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
                <BookmarkBorderIcon
                  sx={{ fontSize: 80, color: "#8b5cf6", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#8b5cf6",
                    mb: 2,
                    fontFamily: '"Orbitron", sans-serif',
                  }}
                >
                  No Bookmarked Articles
                </Typography>
                <Typography variant="body1" sx={{ color: "#c0c4fc", mb: 3 }}>
                  Start bookmarking articles you want to read later!
                </Typography>
                <Chip
                  label="Browse News"
                  onClick={() => navigate("/news")}
                  sx={{
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                    color: "#fff",
                    fontFamily: '"Orbitron", sans-serif',
                    cursor: "pointer",
                    fontSize: "1rem",
                    py: 2,
                  }}
                />
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {savedNews.map((article) => (
                  <Grid item xs={12} sm={6} lg={4} key={article._id}>
                    <NewsCard
                      news={article}
                      isBookmarked={true}
                      isLiked={likedNews.some(
                        (liked) => liked._id === article._id
                      )}
                      onBookmark={() => handleBookmark(article._id)}
                      onLike={() => handleLike(article._id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {likedNews.length === 0 ? (
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
                <FavoriteBorderIcon
                  sx={{ fontSize: 80, color: "#8b5cf6", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#8b5cf6",
                    mb: 2,
                    fontFamily: '"Orbitron", sans-serif',
                  }}
                >
                  No Liked Articles
                </Typography>
                <Typography variant="body1" sx={{ color: "#c0c4fc", mb: 3 }}>
                  Like articles you enjoy to keep them here!
                </Typography>
                <Chip
                  label="Browse News"
                  onClick={() => navigate("/news")}
                  sx={{
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                    color: "#fff",
                    fontFamily: '"Orbitron", sans-serif',
                    cursor: "pointer",
                    fontSize: "1rem",
                    py: 2,
                  }}
                />
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {likedNews.map((article) => (
                  <Grid item xs={12} sm={6} lg={4} key={article._id}>
                    <NewsCard
                      news={article}
                      isBookmarked={savedNews.some(
                        (saved) => saved._id === article._id
                      )}
                      isLiked={true}
                      onBookmark={() => handleBookmark(article._id)}
                      onLike={() => handleLike(article._id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

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
      </Box>
    </ThemeProvider>
  );
};

export default SavedNews;
