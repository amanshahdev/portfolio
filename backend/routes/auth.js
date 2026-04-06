/**
 * routes/auth.js — Express router for authentication endpoints.
 *
 * WHAT: Maps HTTP verbs + paths to authController handlers and attaches
 *       express-validator rules for each route.
 *
 * WHY:  Thin routing layer keeps validation co-located with routes while
 *       controller functions stay free of Express boilerplate.
 */

const express = require("express");
const { body } = require("express-validator");
const { register, login, getProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Validation rules ───────────────────────────────────────────────────────
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter and one number"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];

// ── Routes ─────────────────────────────────────────────────────────────────
router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePasswordRules, changePassword);

module.exports = router;
