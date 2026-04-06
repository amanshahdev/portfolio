/**
 * routes/contact.js — Express router for contact form endpoints.
 *
 * WHAT: Public POST /api/contact for form submissions; protected admin
 *       routes for viewing and managing messages.
 *
 * WHY:  Keeping the public submission endpoint separate from admin
 *       management routes makes it easy to apply different rate limits.
 */

const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const {
  submitContact,
  getMessages,
  getMessage,
  deleteMessage,
  markAsRead,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Contact form rate limit (stricter) ────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many messages sent. Please try again later." },
});

// ── Validation rules ───────────────────────────────────────────────────────
const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("subject").optional().trim().isLength({ max: 200 }),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),
];

// ── Public ─────────────────────────────────────────────────────────────────
router.post("/", contactLimiter, contactRules, submitContact);

// ── Admin (protected) ──────────────────────────────────────────────────────
router.get("/", protect, getMessages);
router.get("/:id", protect, getMessage);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
