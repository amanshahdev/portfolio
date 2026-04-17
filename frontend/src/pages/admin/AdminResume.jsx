import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Loader2,
  ExternalLink,
  Download,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { resumeAPI } from "../../utils/api";
import {
  clearCachedResume,
  readCachedResume,
  writeCachedResume,
} from "../../utils/contentCache";

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminResume() {
  const [resume, setResume] = useState(() => readCachedResume());
  const [loading, setLoading] = useState(() => !readCachedResume());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const accepted = useMemo(() => ".pdf,.doc,.docx", []);

  const fetchResume = async () => {
    try {
      setError("");
      const res = await resumeAPI.getCurrent();
      const nextResume = res.data?.data || null;
      setResume(nextResume);
      writeCachedResume(nextResume);
    } catch (err) {
      if (err.response?.status === 404) {
        setResume(null);
        clearCachedResume();
        return;
      }
      const msg =
        err.response?.data?.message || "Failed to load resume information.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    setUploading(true);
    try {
      const res = await resumeAPI.upload(file);
      const nextResume = res.data?.data || null;
      setResume(nextResume);
      writeCachedResume(nextResume);
      setError("");
      toast.success("Resume uploaded successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to upload resume.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="font-display text-2xl font-semibold text-white mb-1">
          Resume Manager
        </h1>
        <p className="text-sm text-white/40">
          Upload your latest CV so visitors can view and download it from your
          portfolio.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="glass rounded-2xl border border-border-1 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-phosphor/10 border border-phosphor/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-phosphor" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                Current Resume
              </div>
              <div className="text-xs text-white/30">
                PDF, DOC, or DOCX (max 5MB)
              </div>
            </div>
          </div>

          <label className="btn-primary cursor-pointer justify-center sm:justify-start">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload New Resume
              </>
            )}
            <input
              type="file"
              accept={accepted}
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-white/45 py-10">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading resume status...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        ) : !resume ? (
          <div className="rounded-xl border border-border-1 bg-surface-1 px-4 py-5 text-sm text-white/45">
            No resume uploaded yet. Upload one to activate public links.
          </div>
        ) : (
          <div className="rounded-xl border border-border-1 bg-surface-1 p-4 space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-white font-medium break-all">
                {resume.originalName}
              </div>
              <div className="text-xs text-white/35">
                {formatFileSize(resume.size)} • Uploaded{" "}
                {new Date(resume.uploadedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink className="w-4 h-4" />
                View Resume
              </a>
              <a href={resume.fileUrl} download className="btn-ghost">
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
