/**
 * controllers/projectController.js — CRUD for portfolio projects.
 *
 * WHAT: Exports handlers for listing, getting, creating, updating,
 *       deleting, and reordering projects.
 *
 * HOW:  Public routes (GET) query MongoDB with optional category/featured
 *       filters and sort by `order`. Protected routes (POST/PUT/DELETE)
 *       require a valid JWT via the `protect` middleware applied at the
 *       router level.
 *
 * WHY:  Clean controller/route separation allows easy unit testing and
 *       keeps route files as thin mapping layers.
 */

const { validationResult } = require("express-validator");
const Project = require("../models/Project");

function normalizeValidationErrors(errorList) {
  return errorList.map((item) => {
    if (item?.msg !== "Invalid value") return item;

    const fallbackByPath = {
      title: "Title cannot exceed 100 characters",
      description: "Description cannot exceed 1000 characters",
      shortDescription: "Short description cannot exceed 200 characters",
      techStack: "Tech stack must be a non-empty array",
      githubLink: "GitHub link must be a valid URL",
      liveLink: "Live link must be a valid URL",
      category: "Invalid category",
      status: "Invalid status",
    };

    return {
      ...item,
      msg: fallbackByPath[item.path] || "Invalid request data",
    };
  });
}

// ── GET /api/projects ──────────────────────────────────────────────────────
exports.getProjects = async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (featured === "true") filter.featured = true;

    const parsedLimit = Number.parseInt(limit, 10);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : null;

    let query = Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select(
        "title description shortDescription techStack githubLink liveLink imageUrl category featured status order createdAt updatedAt",
      )
      .lean();

    if (safeLimit) {
      query = query.limit(safeLimit);
    }

    const projects = await query;

    res.set("Cache-Control", "public, max-age=60");

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    console.error("Get projects error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching projects." });
  }
};

// ── GET /api/projects/:id ──────────────────────────────────────────────────
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID." });
    }
    console.error("Get project error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/projects ─────────────────────────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorList = normalizeValidationErrors(errors.array());
      return res.status(400).json({
        success: false,
        message: errorList[0]?.msg || "Validation failed.",
        errors: errorList,
      });
    }

    // Auto-assign order as max + 1
    const maxOrder = await Project.findOne()
      .sort({ order: -1 })
      .select("order");
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const project = await Project.create({ ...req.body, order });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("Create project error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error creating project." });
  }
};

// ── PUT /api/projects/:id ──────────────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorList = normalizeValidationErrors(errors.array());
      return res.status(400).json({
        success: false,
        message: errorList[0]?.msg || "Validation failed.",
        errors: errorList,
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID." });
    }
    console.error("Update project error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error updating project." });
  }
};

// ── DELETE /api/projects/:id ───────────────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID." });
    }
    console.error("Delete project error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting project." });
  }
};

// ── PUT /api/projects/reorder ──────────────────────────────────────────────
exports.reorderProjects = async (req, res) => {
  try {
    const { projects } = req.body; // Array of { id, order }
    if (!Array.isArray(projects)) {
      return res
        .status(400)
        .json({ success: false, message: "Expected array of projects." });
    }

    const ops = projects.map(({ id, order }) =>
      Project.findByIdAndUpdate(id, { order }, { new: false }),
    );
    await Promise.all(ops);

    res.json({ success: true, message: "Projects reordered successfully" });
  } catch (err) {
    console.error("Reorder error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error reordering projects." });
  }
};
