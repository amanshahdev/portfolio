const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { protect } = require("../middleware/auth");
const { getResume, uploadResume } = require("../controllers/resumeController");

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    cb(null, `${Date.now()}-${base || "resume"}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(ext)
    ) {
      return cb(null, true);
    }

    return cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
  },
});

router.get("/", getResume);
router.post("/", protect, upload.single("resume"), uploadResume);

module.exports = router;
