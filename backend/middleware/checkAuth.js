const { ValidateToken } = require("../utils/JsonWebToken");

// Base authentication middleware
const checkAuth = (req, res, next) => {
  console.log("🔐 checkAuth - Request received");
  console.log("📋 Headers:", req.headers);

  const authHeader = req.headers.authorization;
  console.log("🎫 Auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid auth header found");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(
    "🔑 Extracted token:",
    token ? `${token.substring(0, 20)}...` : "null"
  );

  const decoded = ValidateToken(token);
  console.log("✅ Decoded token:", decoded);

  if (!decoded) {
    console.log("❌ Token validation failed");
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  console.log("👤 User set in request:", req.user);
  next();
};

// Admin role check middleware (requires checkAuth to run first)
const requireAdmin = (req, res, next) => {
  console.log("👑 requireAdmin - Checking admin role");
  console.log("👤 Current user:", req.user);

  if (!req.user) {
    console.log("❌ No user found in request");
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    console.log(`❌ User role '${req.user.role}' is not admin`);
    return res.status(403).json({
      message: "Admin access required",
      userRole: req.user.role || "no role",
    });
  }

  console.log("✅ Admin access confirmed");
  next();
};

// Combined middleware for admin routes
const checkAdmin = [checkAuth, requireAdmin];

// Role-based middleware factory (for future scalability)
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: `${role} access required`,
        userRole: req.user.role || "no role",
      });
    }

    next();
  };
};

module.exports = {
  checkAuth,
  requireAdmin,
  checkAdmin,
  requireRole,
};
