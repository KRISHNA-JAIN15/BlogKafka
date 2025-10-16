const jwt = require("jsonwebtoken");

const ValidateToken = (token) => {
  try {
    console.log("🔍 ValidateToken - Attempting to verify token");
    console.log(
      "🔑 Token (first 20 chars):",
      token ? token.substring(0, 20) + "..." : "null"
    );
    console.log("🗝️ JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token validated successfully:", decoded);
    return decoded;
  } catch (error) {
    console.log("❌ Token validation failed:", error.message);
    return null;
  }
};

const generateToken = (payload) => {
  console.log("🎫 Generating token for payload:", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }); // Extended to 24 hours
  console.log("✅ Token generated successfully");
  return token;
};

module.exports = { ValidateToken, generateToken };
