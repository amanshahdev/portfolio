/**
 * controllers/contactController.js — Handles contact form submissions.
 *
 * WHAT: Exports submitContact (public) and admin handlers for listing,
 *       reading, and deleting contact messages.
 *
 * HOW:  submitContact() validates input, captures the sender's IP,
 *       and saves the message to MongoDB. Admin routes are protected
 *       by JWT middleware applied at the router.
 *
 * WHY:  Storing messages in MongoDB gives the admin a reliable inbox
 *       accessible from the dashboard, independent of external email.
 */

const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");

// ── POST /api/contact ──────────────────────────────────────────────────────
exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Capture IP (works behind proxies if trust proxy is set)
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    const contact = await Contact.create({ name, email, subject, message, ipAddress });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I will get back to you soon.",
      data: { id: contact._id },
    });
  } catch (err) {
    console.error("Submit contact error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// ── GET /api/contact (admin) ───────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const filter = {};
    if (unread === "true") filter.isRead = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Contact.countDocuments(filter),
    ]);

    const unreadCount = await Contact.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Server error fetching messages." });
  }
};

// ── GET /api/contact/:id (admin) ───────────────────────────────────────────
exports.getMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, data: message });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }
    console.error("Get message error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── DELETE /api/contact/:id (admin) ───────────────────────────────────────
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }
    console.error("Delete message error:", err);
    res.status(500).json({ success: false, message: "Server error deleting message." });
  }
};

// ── PATCH /api/contact/:id/read (admin) ───────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    res.json({ success: true, data: message });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
