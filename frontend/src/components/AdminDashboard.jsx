import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  Fab,
  Alert,
  CircularProgress,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./Navbar";
import AddEditNewsDialog from "./AddEditNewsDialog";
import axios from "axios";
import toast from "react-hot-toast";

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
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
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
    h4: {
      fontWeight: 600,
      color: "#ffffff",
      fontFamily: '"Orbitron", sans-serif',
    },
    h6: {
      fontWeight: 600,
      color: "#8b5cf6",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #1a1428 0%, #2d1b69 100%)",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(26, 20, 40, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(26, 20, 40, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
          transition: "all 0.3s ease",
          "&:hover": {
            border: "1px solid rgba(139, 92, 246, 0.6)",
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.2)",
          },
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalNews: 0,
    recentNews: 0,
    categoriesStats: [],
  });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalNews, setTotalNews] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [error, setError] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch stats and news
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/news/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }
      setError("Failed to fetch statistics");
    }
  }, [navigate]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/news?page=${
          page + 1
        }&limit=${rowsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNews(response.data.news);
      setTotalNews(response.data.pagination.totalNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }
      setError("Failed to fetch news articles");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchStats();
      fetchNews();
    }
  }, [user, fetchStats, fetchNews]);

  const handleAddNews = () => {
    setEditingNews(null);
    setOpenDialog(true);
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setOpenDialog(true);
  };

  const handleDeleteNews = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/news/${newsToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("News article deleted successfully");
      fetchNews();
      fetchStats();
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news article");
    }
  };

  const handleNewsSubmit = () => {
    fetchNews();
    fetchStats();
    setOpenDialog(false);
  };

  const handleToggleFeatured = async (articleId, newFeaturedStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/news/${articleId}`,
        { featured: newFeaturedStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the news list locally
      setNews((prevNews) =>
        prevNews.map((article) =>
          article._id === articleId
            ? { ...article, featured: newFeaturedStatus }
            : article
        )
      );

      toast.success(
        `Article ${
          newFeaturedStatus ? "marked as featured" : "removed from featured"
        }`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      "tech and innovation": "#8b5cf6",
      "finance and money": "#10b981",
      "world and politics": "#ef4444",
      default: "#06b6d4",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
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
        <Container
          maxWidth="xl"
          sx={{ py: 4, position: "relative", zIndex: 1 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 2,
                textAlign: "center",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "#c0c4fc",
                fontWeight: "normal",
              }}
            >
              Manage news articles and monitor platform statistics
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <ArticleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stats.totalNews}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Articles
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #10b981, #059669)",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stats.recentNews}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This Week
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #f59e0b, #d97706)",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <CategoryIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stats.categoriesStats.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Categories
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(45deg, #ef4444, #dc2626)",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <ScheduleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {stats.categoriesStats.length > 0
                          ? Math.max(
                              ...stats.categoriesStats.map((cat) => cat.count)
                            )
                          : 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Top Category
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* News Articles Table */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  color: "#8b5cf6",
                }}
              >
                News Articles Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNews}
                sx={{
                  background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
                  fontFamily: '"Orbitron", sans-serif',
                }}
              >
                Add Article
              </Button>
            </Box>

            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      Title
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      Author
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                      align="center"
                    >
                      Featured
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      Published
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgba(139, 92, 246, 0.1)",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : news.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          No news articles found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    news.map((article) => (
                      <TableRow key={article._id} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "#ffffff",
                            }}
                          >
                            {article.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {article.author}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={article.category}
                            size="small"
                            sx={{
                              background: getCategoryColor(article.category),
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: "0.7rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={article.featured || false}
                            onChange={() =>
                              handleToggleFeatured(
                                article._id,
                                !article.featured
                              )
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#8b5cf6",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: "#8b5cf6",
                                },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(article.publishedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/article/${article._id}`)
                              }
                              sx={{
                                color: "#06b6d4",
                                "&:hover": {
                                  background: "rgba(6, 182, 212, 0.1)",
                                },
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEditNews(article)}
                              sx={{
                                color: "#f59e0b",
                                "&:hover": {
                                  background: "rgba(245, 158, 11, 0.1)",
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setNewsToDelete(article);
                                setDeleteDialogOpen(true);
                              }}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  background: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalNews}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{
                color: "#c0c4fc",
                "& .MuiTablePagination-selectIcon": {
                  color: "#c0c4fc",
                },
              }}
            />
          </Paper>

          {/* Add/Edit News Dialog */}
          <AddEditNewsDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            newsItem={editingNews}
            onSubmit={handleNewsSubmit}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{
              sx: {
                background: "rgba(26, 20, 40, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              },
            }}
          >
            <DialogTitle sx={{ color: "#ef4444" }}>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography color="text.primary">
                Are you sure you want to delete "{newsToDelete?.title}"? This
                action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                sx={{ color: "#c0c4fc" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteNews}
                variant="contained"
                sx={{
                  background: "#ef4444",
                  "&:hover": { background: "#dc2626" },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
