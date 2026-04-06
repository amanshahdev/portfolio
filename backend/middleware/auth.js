/**
 * middleware/auth.js — JWT authentication middleware.
 *
 * WHAT: Express middleware that validates the Bearer JWT token in the
 *       Authorization header and attaches the decoded user to req.user.
 *
 * HOW:  Reads "Authorization: Bearer <token>", verifies it with
 *       JWT_SECRET, fetches the user from MongoDB (confirming they
 *       still exist), then calls next(). Any failure returns 401.
 *
 * WHY:  Centralising auth in middleware means every protected route
 *       simply calls protect() without repeating token logic.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // 3. Check user still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ success: false, message: "Authentication error." });
  }
};

// ── Role guard factory ─────────────────────────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
