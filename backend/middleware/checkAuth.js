const { ValidateToken } = require("../utils/JsonWebToken");

// Base authentication middleware
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = ValidateToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
};

// Admin role check middleware (requires checkAuth to run first)
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
      userRole: req.user.role || "no role",
    });
  }

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
