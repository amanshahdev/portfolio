/**
 * models/Project.js — Mongoose schema for portfolio projects.
 *
 * WHAT: Defines the Project document with title, description, tech stack,
 *       links, category, featured flag, order, and image URL.
 *
 * HOW:  Uses arrays for techStack and images. Virtual `id` is included
 *       in JSON. Timestamps add createdAt / updatedAt automatically.
 *       Index on `order` and `featured` keeps listing queries fast.
 *
 * WHY:  Rich schema allows the admin panel to manage all project metadata
 *       and the frontend to render dynamic, filterable project cards.
 */

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    techStack: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one technology is required",
      },
    },
    githubLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    liveLink: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["fullstack", "frontend", "backend", "mobile", "other"],
      default: "fullstack",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes for common query patterns ─────────────────────────────────────
projectSchema.index({ order: 1 });
projectSchema.index({ featured: -1, order: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model("Project", projectSchema);
