const express = require("express");
const path = require("path");
const multer = require("multer");
const { protect } = require("../middleware/auth");
const {
  getResume,
  uploadResume,
  downloadResume,
} = require("../controllers/resumeController");

const router = express.Router();
const storage = multer.memoryStorage();

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
router.get("/file", downloadResume);
router.post("/", protect, upload.single("resume"), uploadResume);

module.exports = router;
