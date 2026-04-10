const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const backendRootDir = path.resolve(__dirname, "..");

function buildPublicResumeUrl(req, filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  return `${proto}://${req.get("host")}/${normalized}`;
}

function resolveResumeAbsolutePath(filePath = "") {
  const relativeFilePath = filePath.replace(/^[/\\]+/, "");
  return path.join(backendRootDir, relativeFilePath);
}

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ key: "default" }).lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded yet.",
      });
    }

    const absolutePath = resolveResumeAbsolutePath(resume.filePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file is missing. Please upload a new resume.",
      });
    }

    const fileUrl = buildPublicResumeUrl(req, resume.filePath);

    return res.json({
      success: true,
      data: {
        id: resume._id,
        originalName: resume.originalName,
        fileName: resume.fileName,
        mimeType: resume.mimeType,
        size: resume.size,
        uploadedAt: resume.uploadedAt,
        fileUrl,
      },
    });
  } catch (err) {
    console.error("Get resume error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resume.",
    });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file.",
      });
    }

    const existing = await Resume.findOne({ key: "default" });

    if (existing?.filePath) {
      const oldAbsolutePath = resolveResumeAbsolutePath(existing.filePath);
      if (fs.existsSync(oldAbsolutePath)) {
        fs.unlinkSync(oldAbsolutePath);
      }
    }

    const payload = {
      key: "default",
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: path.posix.join("uploads", "resumes", req.file.filename),
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    const resume = await Resume.findOneAndUpdate({ key: "default" }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    const fileUrl = buildPublicResumeUrl(req, resume.filePath);

    return res.json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        id: resume._id,
        originalName: resume.originalName,
        fileName: resume.fileName,
        mimeType: resume.mimeType,
        size: resume.size,
        uploadedAt: resume.uploadedAt,
        fileUrl,
      },
    });
  } catch (err) {
    console.error("Upload resume error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error uploading resume.",
    });
  }
};
