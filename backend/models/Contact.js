/**
 * models/Contact.js — Mongoose schema for contact form messages.
 *
 * WHAT: Stores visitor messages submitted via the contact form.
 *       Fields: name, email, subject, message, read status, IP.
 *
 * HOW:  `isRead` flag lets the admin panel mark messages as read.
 *       `ipAddress` is stored for basic spam tracking.
 *       Timestamps provide submission date automatically.
 *
 * WHY:  Persisting messages in MongoDB gives the admin a full inbox
 *       accessible from the dashboard without relying on email delivery.
 */

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
      default: "Portfolio Contact",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ── Index for admin inbox queries ──────────────────────────────────────────
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
