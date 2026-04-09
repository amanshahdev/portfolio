/**
 * routes/projects.js — Express router for project CRUD endpoints.
 *
 * WHAT: Public GET routes for fetching projects; protected POST/PUT/DELETE
 *       routes requiring JWT auth for admin operations.
 *
 * WHY:  Separation of public read routes and protected write routes
 *       enforces the security boundary at the routing layer.
 */

const express = require("express");
const { body } = require("express-validator");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Validation rules ───────────────────────────────────────────────────────
const projectRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("shortDescription")
    .optional({ checkFalsy: true })
    .isLength({ max: 200 })
    .withMessage("Short description cannot exceed 200 characters"),
  body("techStack")
    .isArray({ min: 1 })
    .withMessage("Tech stack must be a non-empty array"),
  body("githubLink")
    .optional({ checkFalsy: true })
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: false,
    })
    .withMessage("GitHub link must be a valid URL"),
  body("liveLink")
    .optional({ checkFalsy: true })
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_tld: false,
    })
    .withMessage("Live link must be a valid URL"),
  body("category")
    .optional()
    .isIn(["fullstack", "frontend", "backend", "mobile", "other"])
    .withMessage("Invalid category"),
  body("status")
    .optional()
    .isIn(["completed", "in-progress", "archived"])
    .withMessage("Invalid status"),
];

// ── Public routes ──────────────────────────────────────────────────────────
router.get("/", getProjects);
router.get("/:id", getProject);

// ── Protected routes ───────────────────────────────────────────────────────
router.post("/", protect, projectRules, createProject);
router.put("/reorder", protect, reorderProjects);
router.put("/:id", protect, projectRules, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
