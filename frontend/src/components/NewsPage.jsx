import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import NewsGrid from "./NewsGrid";
import Navbar from "./Navbar";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6", // Purple from homepage
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#06b6d4", // Cyan from homepage
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
    info: {
      main: "#10b981", // Green from homepage
    },
    warning: {
      main: "#f59e0b", // Amber from homepage
    },
    error: {
      main: "#ef4444", // Red from homepage
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
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #1a1428 0%, #2d1b69 100%)",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        },
        "@import": [
          "url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap')",
        ],
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "rgba(26, 20, 40, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow:
            "0 8px 32px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            border: "1px solid rgba(139, 92, 246, 0.8)",
            boxShadow:
              "0 20px 40px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.3)",
            transform: "translateY(-8px) scale(1.02)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontFamily: '"Orbitron", sans-serif',
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            transition: "left 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
          color: "#fff",
          boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
          "&:hover": {
            background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
            boxShadow: "0 6px 20px rgba(139, 92, 246, 0.6)",
          },
        },
        outlined: {
          borderColor: "#8b5cf6",
          color: "#8b5cf6",
          borderWidth: "2px",
          "&:hover": {
            borderColor: "#06b6d4",
            color: "#06b6d4",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontFamily: '"Orbitron", sans-serif',
          border: "1px solid rgba(139, 92, 246, 0.5)",
          background: "rgba(139, 92, 246, 0.1)",
          color: "#8b5cf6",
          "&:hover": {
            background: "rgba(139, 92, 246, 0.2)",
            boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
          },
        },
        filled: {
          background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
          color: "#fff",
          border: "none",
          "&:hover": {
            background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          "&:hover": {
            border: "1px solid rgba(139, 92, 246, 0.8)",
            boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "rgba(26, 20, 40, 0.7)",
            "& fieldset": {
              borderColor: "rgba(139, 92, 246, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(139, 92, 246, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8b5cf6",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
            },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
          color: "#fff",
          border: "2px solid rgba(139, 92, 246, 0.5)",
          "&:hover": {
            background: "linear-gradient(45deg, #a78bfa, #67e8f9)",
            boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)",
          },
        },
      },
    },
  },
});

const NewsPage = () => {
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
        <NewsGrid />
      </Box>
    </ThemeProvider>
  );
};

export default NewsPage;
