const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Function to check Cloudinary configuration
const checkCloudinaryConfig = () => {
  const hasConfig = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  console.log("� Checking Cloudinary configuration...");
  console.log(
    "📋 CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME || "missing"
  );
  console.log(
    "📋 CLOUDINARY_API_KEY:",
    process.env.CLOUDINARY_API_KEY || "missing"
  );
  console.log(
    "📋 CLOUDINARY_API_SECRET:",
    process.env.CLOUDINARY_API_SECRET ? "***hidden***" : "missing"
  );
  console.log("📋 hasCloudinaryConfig:", hasConfig);

  return hasConfig;
};

const hasCloudinaryConfig = checkCloudinaryConfig();

if (!hasCloudinaryConfig) {
  console.warn(
    "⚠️  Cloudinary credentials not found. Image uploads will be disabled."
  );
  console.warn(
    "Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file"
  );
} else {
  console.log("✅ Cloudinary configuration loaded successfully");
}

if (hasCloudinaryConfig) {
  console.log("🔧 Configuring Cloudinary...");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary config applied");
}

let storage;

if (hasCloudinaryConfig) {
  console.log("🏗️ Creating CloudinaryStorage...");
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "news-app", // Folder name in Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [
        {
          width: 800,
          height: 400,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    },
  });
  console.log("✅ CloudinaryStorage created successfully");
} else {
  console.log("⚠️ Using memory storage as fallback");
  // Fallback to memory storage if Cloudinary is not configured
  storage = multer.memoryStorage();
}

// Create multer instance with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("🔍 File filter - checking file:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Check file type
    if (file.mimetype.startsWith("image/")) {
      console.log("✅ File filter - Image file accepted");
      cb(null, true);
    } else {
      console.log("❌ File filter - Not an image file, rejecting");
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Function to get current Cloudinary configuration status
const getCurrentCloudinaryConfig = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Function to manually upload to Cloudinary
const uploadToCloudinary = async (buffer, options = {}) => {
  const currentConfig = getCurrentCloudinaryConfig();

  if (!currentConfig) {
    throw new Error("Cloudinary configuration not available");
  }

  // Ensure Cloudinary is configured
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("🔧 Cloudinary configured on-demand");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "news-app",
          transformation: [
            {
              width: 800,
              height: 400,
              crop: "fill",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!hasCloudinaryConfig) {
      console.warn("Cloudinary not configured, skipping image deletion");
      return { result: "ok" };
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

module.exports = {
  cloudinary: hasCloudinaryConfig ? cloudinary : null,
  upload,
  deleteFromCloudinary,
  extractPublicId,
  hasCloudinaryConfig,
  getCurrentCloudinaryConfig,
  uploadToCloudinary,
};
