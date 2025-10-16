import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Chip,
  IconButton,
  Box,
  Avatar,
  Tooltip,
  CardHeader,
  Divider,
} from "@mui/material";
import {
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ReadMore as ReadMoreIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import NewsImage from "./NewsImage";

const NewsCard = ({
  news,
  onBookmark,
  onShare,
  onLike,
  isBookmarked = false,
  isLiked = false,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleReadMore = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to read full articles");
      navigate("/");
      return;
    }
    navigate(`/article/${news._id}`);
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like articles");
      navigate("/");
      return;
    }
    onLike?.(news._id);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark articles");
      navigate("/");
      return;
    }
    onBookmark?.(news._id);
  };

  const handleShare = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to share articles");
      navigate("/");
      return;
    }
    onShare?.(news);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays}d ago`;
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "tech and innovation": "linear-gradient(45deg, #8b5cf6, #06b6d4)",
      "finance and money": "linear-gradient(45deg, #10b981, #059669)",
      "world and politics": "linear-gradient(45deg, #ef4444, #f97316)",
      default: "linear-gradient(45deg, #8b5cf6, #7c3aed)",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getCategoryGlow = (category) => {
    const glows = {
      "tech and innovation": "0 0 20px rgba(139, 92, 246, 0.6)",
      "finance and money": "0 0 20px rgba(16, 185, 129, 0.6)",
      "world and politics": "0 0 20px rgba(239, 68, 68, 0.6)",
      default: "0 0 20px rgba(139, 92, 246, 0.6)",
    };
    return glows[category?.toLowerCase()] || glows.default;
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "fit-content",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        background: "rgba(26, 20, 40, 0.85)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        },
        "&:hover": {
          transform: "translateY(-12px) scale(1.03)",
          border: "1px solid rgba(139, 92, 246, 0.8)",
          boxShadow:
            "0 25px 50px rgba(139, 92, 246, 0.2), 0 0 30px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          "&::before": {
            opacity: 1,
          },
          "& .news-image": {
            transform: "scale(1.1)",
            filter: "brightness(1.2) saturate(1.3)",
          },
          "& .category-chip": {
            boxShadow: getCategoryGlow(news.category),
            transform: "scale(1.1)",
          },
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      {/* Category Badge */}
      {news.category && (
        <Chip
          label={news.category}
          size="small"
          className="category-chip"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 3,
            background: getCategoryColor(news.category),
            color: "#000",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "0.7rem",
            fontFamily: '"Orbitron", sans-serif',
            border: "1px solid rgba(255, 255, 255, 0.3)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
        />
      )}

      {/* News Image */}
      <NewsImage
        src={news.image}
        alt={news.title}
        height={200}
        className="news-image"
        sx={{
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          filter: "brightness(0.9) contrast(1.1)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
            pointerEvents: "none",
          },
        }}
      />

      {/* Card Header with Author Info */}
      <CardHeader
        avatar={
          <Avatar
            sx={{
              background: getCategoryColor(news.category),
              border: "2px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
            }}
          >
            <PersonIcon sx={{ color: "#000" }} />
          </Avatar>
        }
        title={
          <Typography
            variant="subtitle2"
            sx={{
              color: "#8b5cf6",
              fontWeight: "bold",
              fontFamily: '"Orbitron", sans-serif',
              textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
            }}
          >
            {news.author || "Unknown Author"}
          </Typography>
        }
        subheader={
          <Box display="flex" alignItems="center" gap={0.5}>
            <TimeIcon fontSize="small" sx={{ color: "#06b6d4" }} />
            <Typography
              variant="caption"
              sx={{
                color: "#b0bec5",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              {formatDate(news.publishedAt)}
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      {/* Card Content */}
      <CardContent sx={{ pt: 0 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: "bold",
            lineHeight: 1.3,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "#ffffff",
            fontFamily: '"Orbitron", sans-serif',
            textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
          }}
        >
          {news.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
            color: "#b0bec5",
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          {truncateText(news.content)}
        </Typography>

        {/* Source */}
        {news.source && (
          <Box mt={1}>
            <Typography
              variant="caption"
              sx={{
                color: "#8b5cf6",
                fontWeight: "bold",
                fontFamily: '"Orbitron", sans-serif',
                textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
              }}
            >
              Source: {news.source}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.2)" }} />

      {/* Card Actions */}
      <CardActions
        disableSpacing
        sx={{
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <Box display="flex" gap={0.5}>
          {/* Like Button */}
          <Tooltip
            title={
              isAuthenticated
                ? isLiked
                  ? "Unlike"
                  : "Like"
                : "Sign in to like"
            }
          >
            <IconButton
              onClick={handleLike}
              size="small"
              sx={{
                color: isAuthenticated
                  ? isLiked
                    ? "#06b6d4"
                    : "#b0bec5"
                  : "#ef4444",
                opacity: isAuthenticated ? 1 : 0.7,
                "&:hover": {
                  color: isAuthenticated ? "#06b6d4" : "#f97316",
                  boxShadow: isAuthenticated
                    ? "0 0 15px rgba(6, 182, 212, 0.5)"
                    : "0 0 15px rgba(239, 68, 68, 0.5)",
                },
              }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* Bookmark Button */}
          <Tooltip
            title={
              isAuthenticated
                ? isBookmarked
                  ? "Remove Bookmark"
                  : "Bookmark"
                : "Sign in to bookmark"
            }
          >
            <IconButton
              onClick={handleBookmark}
              size="small"
              sx={{
                color: isAuthenticated
                  ? isBookmarked
                    ? "#8b5cf6"
                    : "#b0bec5"
                  : "#ef4444",
                opacity: isAuthenticated ? 1 : 0.7,
                "&:hover": {
                  color: isAuthenticated ? "#8b5cf6" : "#f97316",
                  boxShadow: isAuthenticated
                    ? "0 0 15px rgba(139, 92, 246, 0.5)"
                    : "0 0 15px rgba(239, 68, 68, 0.5)",
                },
              }}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* Share Button */}
          <Tooltip title={isAuthenticated ? "Share" : "Sign in to share"}>
            <IconButton
              onClick={handleShare}
              size="small"
              sx={{
                color: isAuthenticated ? "#b0bec5" : "#ef4444",
                opacity: isAuthenticated ? 1 : 0.7,
                "&:hover": {
                  color: isAuthenticated ? "#10b981" : "#f97316",
                  boxShadow: isAuthenticated
                    ? "0 0 15px rgba(16, 185, 129, 0.5)"
                    : "0 0 15px rgba(239, 68, 68, 0.5)",
                },
              }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box display="flex" gap={0.5}>
          {/* Read More Button */}
          <Button
            size="small"
            onClick={handleReadMore}
            variant="outlined"
            sx={{
              borderColor: isAuthenticated ? "#8b5cf6" : "#ef4444",
              color: isAuthenticated ? "#8b5cf6" : "#ef4444",
              fontFamily: '"Orbitron", sans-serif',
              fontSize: "0.75rem",
              "&:hover": {
                borderColor: isAuthenticated ? "#06b6d4" : "#f97316",
                color: isAuthenticated ? "#06b6d4" : "#f97316",
                boxShadow: isAuthenticated
                  ? "0 0 15px rgba(6, 182, 212, 0.4)"
                  : "0 0 15px rgba(239, 68, 68, 0.4)",
              },
            }}
            endIcon={<ReadMoreIcon />}
          >
            {isAuthenticated ? "Read More" : "Sign In to Read"}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
