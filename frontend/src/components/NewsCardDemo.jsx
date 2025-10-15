import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  NewspaperOutlined as NewsIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import NewsCard from "./NewsCard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Sample news item for demo
const sampleNewsItem = {
  _id: "demo-1",
  title: "Interactive News Card Component Demo",
  content:
    "This is a demonstration of the enhanced news card component built with Material-UI. The card features interactive elements like bookmarking, liking, sharing, expandable content, and beautiful hover animations. It includes author information, publication time, category badges, and supports both light and responsive design patterns.",
  author: "GitHub Copilot",
  publishedAt: new Date().toISOString(),
  source: "Demo Source",
  image:
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=345&h=200&fit=crop",
  url: "https://example.com/demo",
  category: "Technology",
};

const NewsCardDemo = () => {
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = (newsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.content.substring(0, 100) + "...",
        url: newsItem.url,
      });
    } else {
      navigator.clipboard.writeText(newsItem.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <NewsIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Enhanced News Card Demo
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Interactive, beautiful, and responsive news cards built with
            Material-UI
          </Typography>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>Features Showcase</AlertTitle>
          Try the interactive features: bookmark, like, share, expand content,
          and hover effects!
        </Alert>

        {/* Demo Card */}
        <Box display="flex" justifyContent="center" mb={4}>
          <NewsCard
            news={sampleNewsItem}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onLike={handleLike}
            isBookmarked={isBookmarked}
            isLiked={isLiked}
          />
        </Box>

        {/* Features List */}
        <Box mt={6}>
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Card Features
          </Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            {[
              "🎨 Beautiful hover animations and transitions",
              "📱 Fully responsive design",
              "🔖 Interactive bookmark functionality",
              "❤️ Like/unlike with heart animation",
              "📤 Native share API support with fallback",
              "📖 Expandable content with smooth transitions",
              "🏷️ Category badges with dynamic colors",
              "👤 Author information with avatar",
              "⏰ Smart relative time formatting",
              "🖼️ Image error handling with fallback",
              "🔗 External link support",
              "📊 Clean typography and spacing",
              "🎯 Accessible design with tooltips",
              "🌟 Material Design 3 styling",
            ].map((feature, index) => (
              <Alert key={index} severity="success" variant="outlined">
                {feature}
              </Alert>
            ))}
          </Stack>
        </Box>

        {/* Navigation */}
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" gutterBottom>
            Ready to see more?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<NewsIcon />}
              href="/news"
            >
              View Full News Grid
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CodeIcon />}
              onClick={() => window.open("https://github.com", "_blank")}
            >
              View Source Code
            </Button>
          </Stack>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default NewsCardDemo;
