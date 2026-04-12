const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const backendRootDir = path.resolve(__dirname, "..");

function buildResumeDownloadUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  return `${proto}://${req.get("host")}/api/resume/file`;
}

function buildPublicResumeUrl(req, filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  return `${proto}://${req.get("host")}/${normalized}`;
}

function resolveResumeAbsolutePath(filePath = "") {
  const relativeFilePath = filePath.replace(/^[/\\]+/, "");
  return path.join(backendRootDir, relativeFilePath);
}

async function persistFileDataIfMissing(resumeId, absolutePath) {
  try {
    const fileData = fs.readFileSync(absolutePath);
    await Resume.findByIdAndUpdate(resumeId, { fileData }, { new: false });
  } catch (err) {
    console.error("Resume migration-to-DB warning:", err.message);
  }
}

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ key: "default" })
      .select("+fileData")
      .lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded yet.",
      });
    }

    const hasInlineData = Boolean(
      resume.fileData && resume.fileData.length > 0,
    );
    const absolutePath = resume.filePath
      ? resolveResumeAbsolutePath(resume.filePath)
      : "";
    const hasDiskFile = absolutePath ? fs.existsSync(absolutePath) : false;

    if (!hasInlineData && !hasDiskFile) {
      return res.status(404).json({
        success: false,
        message: "Resume file is missing. Please upload a new resume.",
      });
    }

    const fileUrl = hasInlineData
      ? buildResumeDownloadUrl(req)
      : buildPublicResumeUrl(req, resume.filePath);

    if (!hasInlineData && hasDiskFile) {
      await persistFileDataIfMissing(resume._id, absolutePath);
    }

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

exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ key: "default" }).select("+fileData");

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded yet.",
      });
    }

    if (resume.fileData && resume.fileData.length > 0) {
      res.setHeader(
        "Content-Type",
        resume.mimeType || "application/octet-stream",
      );
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${resume.originalName || resume.fileName || "resume"}"`,
      );
      return res.send(resume.fileData);
    }

    const absolutePath = resolveResumeAbsolutePath(resume.filePath || "");
    if (absolutePath && fs.existsSync(absolutePath)) {
      await persistFileDataIfMissing(resume._id, absolutePath);
      return res.sendFile(absolutePath);
    }

    return res.status(404).json({
      success: false,
      message: "Resume file is missing. Please upload a new resume.",
    });
  } catch (err) {
    console.error("Download resume error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resume file.",
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

    const ext = path.extname(req.file.originalname || "").toLowerCase();
    const base = path
      .basename(req.file.originalname || "resume", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    const generatedFileName = `${Date.now()}-${base || "resume"}${ext}`;

    const payload = {
      key: "default",
      originalName: req.file.originalname,
      fileName: generatedFileName,
      filePath: "api/resume/file",
      mimeType: req.file.mimetype,
      size: req.file.size,
      fileData: req.file.buffer,
      uploadedAt: new Date(),
    };

    const resume = await Resume.findOneAndUpdate({ key: "default" }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    const fileUrl = buildResumeDownloadUrl(req);

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
