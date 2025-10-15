import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
  IconButton,
  Box,
  Avatar,
  Tooltip,
  Collapse,
  CardHeader,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  OpenInNew as OpenInNewIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

const NewsCard = ({
  news,
  onBookmark,
  onShare,
  onLike,
  isBookmarked = false,
  isLiked = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleImageError = () => {
    setImageError(true);
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
      technology: "#2196f3",
      business: "#4caf50",
      sports: "#ff9800",
      entertainment: "#e91e63",
      health: "#00bcd4",
      science: "#9c27b0",
      politics: "#f44336",
      default: "#757575",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const defaultImage =
    "https://via.placeholder.com/345x140/f5f5f5/666666?text=News";

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "fit-content",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[8],
          "& .news-image": {
            transform: "scale(1.05)",
          },
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Category Badge */}
      {news.category && (
        <Chip
          label={news.category}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            backgroundColor: getCategoryColor(news.category),
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        />
      )}

      {/* News Image */}
      <CardMedia
        component="img"
        alt={news.title}
        height="200"
        image={imageError ? defaultImage : news.image || defaultImage}
        onError={handleImageError}
        className="news-image"
        sx={{
          transition: "transform 0.3s ease-in-out",
          objectFit: "cover",
        }}
      />

      {/* Card Header with Author Info */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: getCategoryColor(news.category) }}>
            <PersonIcon />
          </Avatar>
        }
        title={
          <Typography
            variant="subtitle2"
            color="text.primary"
            fontWeight="bold"
          >
            {news.author || "Unknown Author"}
          </Typography>
        }
        subheader={
          <Box display="flex" alignItems="center" gap={0.5}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
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
          }}
        >
          {news.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {expanded ? news.content : truncateText(news.content)}
        </Typography>

        {/* Source */}
        {news.source && (
          <Box mt={1}>
            <Typography variant="caption" color="primary" fontWeight="bold">
              Source: {news.source}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />

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
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton
              onClick={() => onLike?.(news._id)}
              color={isLiked ? "error" : "default"}
              size="small"
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* Bookmark Button */}
          <Tooltip title={isBookmarked ? "Remove Bookmark" : "Bookmark"}>
            <IconButton
              onClick={() => onBookmark?.(news._id)}
              color={isBookmarked ? "primary" : "default"}
              size="small"
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* Share Button */}
          <Tooltip title="Share">
            <IconButton onClick={() => onShare?.(news)} size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box display="flex" gap={0.5}>
          {/* Read More/Less Button */}
          {news.content.length > 150 && (
            <Button
              size="small"
              onClick={handleExpandClick}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              }
            >
              {expanded ? "Show Less" : "Read More"}
            </Button>
          )}

          {/* External Link Button */}
          {news.url && (
            <Tooltip title="Open Original Article">
              <IconButton
                component="a"
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                color="primary"
              >
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Expanded Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" paragraph>
            {news.content}
          </Typography>

          {/* Additional metadata in expanded view */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Published: {new Date(news.publishedAt).toLocaleDateString()}
            </Typography>
            {news.source && (
              <Typography variant="caption" color="primary" fontWeight="bold">
                {news.source}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default NewsCard;
