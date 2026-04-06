/**
 * controllers/authController.js — Handles admin authentication.
 *
 * WHAT: Exports register, login, getProfile, and changePassword handlers.
 *
 * HOW:  register() creates the first admin (blocked if one already exists).
 *       login() verifies credentials and issues a signed JWT.
 *       getProfile() returns the authenticated user's data.
 *       changePassword() lets an admin update their password.
 *
 * WHY:  Separating controller logic from route definitions keeps code
 *       testable and the routes file clean.
 */

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// ── Helper: sign JWT ───────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── POST /api/auth/register ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Only allow one admin
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "An admin account already exists. Please log in.",
      });
    }

    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: "admin" });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      token,
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Fetch user WITH password field (select: false by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ── GET /api/auth/profile ──────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id);
    res.json({ success: true, message: "Password changed successfully.", token });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
