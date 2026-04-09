import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Loader2 } from "lucide-react";
import { projectsAPI } from "../utils/api";

const categoryColors = {
  fullstack: "#00ff88",
  frontend: "#38bdf8",
  backend: "#a855f7",
  mobile: "#f59e0b",
  other: "#6b7280",
};

const statusColors = {
  completed: { text: "#00ff88", bg: "rgba(0,255,136,0.1)", label: "Completed" },
  "in-progress": {
    text: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "In Progress",
  },
  archived: { text: "#6b7280", bg: "rgba(107,114,128,0.1)", label: "Archived" },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    projectsAPI
      .getOne(id)
      .then((res) => setProject(res.data?.data || null))
      .catch((err) => {
        const msg = err.response?.data?.message || "Unable to load project details.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-phosphor animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/35 hover:text-phosphor transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to projects
          </Link>

          <div className="card text-center py-16">
            <p className="text-white/60 mb-4">{error || "Project not found."}</p>
            <Link to="/projects" className="btn-secondary">
              View all projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryColor = categoryColors[project.category] || "#00ff88";
  const status = statusColors[project.status] || statusColors.completed;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/35 hover:text-phosphor transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to projects
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                color: categoryColor,
                background: `${categoryColor}15`,
                border: `1px solid ${categoryColor}25`,
              }}
            >
              {project.category}
            </span>
            <span
              className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ color: status.text, background: status.bg }}
            >
              {status.label}
            </span>
            {project.featured && (
              <span className="text-xs font-mono px-2 py-1 rounded-full bg-aurora/15 border border-aurora/25 text-aurora-2">
                Featured
              </span>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">
              {project.title}
            </h1>
            {project.shortDescription && (
              <p className="text-white/55">{project.shortDescription}</p>
            )}
          </div>

          {project.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-border-1 bg-void-1">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-auto max-h-[420px] object-cover"
              />
            </div>
          )}

          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
              Description
            </p>
            <p className="text-white/65 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {(project.techStack || []).map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-1">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Live Demo
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
}