import React, { useState } from "react";
import { Box, CircularProgress, CardMedia } from "@mui/material";
import { getSafeImageUrl, getOptimizedImageUrl } from "../utils/imageUtils";

const NewsImage = ({
  src,
  alt,
  width = 345,
  height = 200,
  className = "",
  sx = {},
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    console.log("Image failed to load:", src, "Retry count:", retryCount);
    setLoading(false);
    setError(true);

    // Try a different fallback image if we haven't retried too many times
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1);
      setError(false);
      setLoading(true);
    }
  };

  const getImageSrc = () => {
    if (error || retryCount > 0) {
      return getSafeImageUrl(src, retryCount);
    }

    return getOptimizedImageUrl(src, {
      width,
      height,
      quality: "auto",
      format: "auto",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: height,
        overflow: "hidden",
        ...sx,
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(26, 20, 40, 0.8)",
            zIndex: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#8b5cf6" }} />
        </Box>
      )}

      <CardMedia
        component="img"
        alt={alt}
        height={height}
        image={getImageSrc()}
        onLoad={handleLoad}
        onError={handleError}
        className={className}
        sx={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
};

export default NewsImage;
