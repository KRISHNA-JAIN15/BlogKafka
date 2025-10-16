// Image utility functions for handling news images

export const DEFAULT_NEWS_IMAGE =
  "https://via.placeholder.com/600x300/1a1428/8b5cf6?text=News+Article";

export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
  "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
];

// Validate if a URL is a valid image URL
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  try {
    new URL(url);
    // Check if it's a valid image extension or from known image services
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    const imageServices = /(cloudinary|unsplash|placeholder|via\.placeholder)/i;

    return imageExtensions.test(url) || imageServices.test(url);
  } catch {
    return false;
  }
};

// Get a safe image URL with fallback
export const getSafeImageUrl = (imageUrl, fallbackIndex = 0) => {
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }

  // Use a rotating fallback image
  const fallbackImg = FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  return fallbackImg || DEFAULT_NEWS_IMAGE;
};

// Get optimized Cloudinary URL if it's a Cloudinary image
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return DEFAULT_NEWS_IMAGE;

  const {
    width = 600,
    height = 300,
    quality = "auto",
    format = "auto",
  } = options;

  // Check if it's a Cloudinary URL
  if (imageUrl.includes("cloudinary.com")) {
    // Extract the public ID and apply transformations
    const urlParts = imageUrl.split("/upload/");
    if (urlParts.length === 2) {
      const baseUrl = urlParts[0] + "/upload/";
      const transformation = `c_fill,w_${width},h_${height},q_${quality},f_${format}/`;
      const publicId = urlParts[1];

      return baseUrl + transformation + publicId;
    }
  }

  // For non-Cloudinary images, return as is if valid, otherwise use fallback
  return isValidImageUrl(imageUrl) ? imageUrl : DEFAULT_NEWS_IMAGE;
};

// Preload image to check if it loads successfully
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};
