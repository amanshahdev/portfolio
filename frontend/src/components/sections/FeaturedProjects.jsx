/**
 * FeaturedProjects.jsx — Featured project cards for the home page.
 *
 * WHAT: Fetches up to 3 featured projects from the API and renders
 *       premium animated cards with hover effects.
 *
 * HOW:  Calls GET /api/projects?featured=true&limit=3. Each card has
 *       tilt/glow hover effect via Framer Motion. Tech tags are displayed
 *       with animated entrance.
 *
 * WHY:  Showing work directly on the home page increases engagement
 *       without requiring visitors to navigate away.
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, ArrowRight, Loader2 } from "lucide-react";
import { projectsAPI } from "../../utils/api";

const FEATURED_CACHE_KEY = "portfolio_featured_projects_cache_v1";

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const navigate = useNavigate();

  const categoryColors = {
    fullstack: "#00ff88",
    frontend: "#38bdf8",
    backend: "#a855f7",
    mobile: "#f59e0b",
    other: "#6b7280",
  };

  const color = categoryColors[project.category] || "#00ff88";
  const openDetails = () => navigate(`/projects/${project._id}`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6 }}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative glass rounded-2xl overflow-hidden border border-border-1
                 hover:border-white/15 transition-all duration-500 hover:shadow-card-hover cursor-pointer
                 flex flex-col"
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
      />

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px at 50% 0%, ${color}08 0%, transparent 70%)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Category + number */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              color: color,
              background: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            {project.category}
          </span>
          <span className="text-2xl font-display font-bold text-white/5 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-xl text-white mb-3 group-hover:text-white transition-colors leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-5 flex-1">
          {project.shortDescription || project.description.slice(0, 120) + "…"}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="tag text-xs">
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="tag text-xs">+{project.techStack.length - 5}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-border-1">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white transition-colors duration-200 group/link"
            >
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-phosphor transition-colors duration-200 ml-auto"
            >
              Live Demo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const fetchFeaturedProjects = async ({ withSpinner = true } = {}) => {
    if (withSpinner) {
      setLoading(true);
    }

    try {
      setError("");
      const res = await projectsAPI.getAll({ featured: true, limit: 3 });
      const nextProjects = res.data?.data || [];
      setProjects(nextProjects);
      localStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify(nextProjects));
    } catch (err) {
      const msg =
        err.response?.data?.message || "Could not load featured projects.";
      setError(msg);
      const cached = localStorage.getItem(FEATURED_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setProjects(parsed);
          }
        } catch {
          // Ignore invalid cache payloads.
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(FEATURED_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setLoading(false);
        }
      } catch {
        // Ignore invalid cache payloads.
      }
    }

    fetchFeaturedProjects({ withSpinner: !cached });
  }, []);

  return (
    <section ref={ref} className="py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">
              <span className="w-2 h-2 rounded-full bg-phosphor" />
              Selected Work
            </span>
            <h2 className="section-heading text-white">
              Featured
              <br />
              <span className="text-gradient-phosphor">Projects</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/projects" className="btn-ghost group">
              View all projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-phosphor animate-spin" />
          </div>
        ) : error && projects.length === 0 ? (
          <div className="text-center py-24 text-white/30 space-y-3">
            <p>{error}</p>
            <button
              onClick={() => fetchFeaturedProjects()}
              className="text-sm text-phosphor hover:underline"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            No featured projects yet.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                Showing cached featured projects while we retry the latest data.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
