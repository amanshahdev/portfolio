/**
 * pages/Projects.jsx — Full projects listing with category filters.
 *
 * WHAT: Fetches all projects from the API and displays them in a
 *       filterable grid with animated cards.
 *
 * HOW:  Category filter tabs use local state. AnimatePresence handles
 *       smooth card exit/enter when filtering. Each card shows full
 *       details including tech stack, links, and status badge.
 *
 * WHY:  A filterable grid lets visitors quickly find projects relevant
 *       to their interests (frontend, backend, fullstack, etc.).
 */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Loader2, Search, Filter } from "lucide-react";
import { projectsAPI } from "../utils/api";

const PROJECTS_CACHE_KEY = "portfolio_projects_cache_v1";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "mobile", label: "Mobile" },
];

const categoryColors = {
  fullstack: "rgb(var(--phosphor-rgb))",
  frontend: "#38bdf8",
  backend: "#a855f7",
  mobile: "#f59e0b",
  other: "#6b7280",
};

const statusColors = {
  completed: {
    text: "rgb(var(--phosphor-rgb))",
    bg: "rgba(var(--phosphor-rgb),0.1)",
    label: "Completed",
  },
  "in-progress": {
    text: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "In Progress",
  },
  archived: { text: "#6b7280", bg: "rgba(107,114,128,0.1)", label: "Archived" },
};

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const isAccentCategory = project.category === "fullstack";
  const color = categoryColors[project.category] || "rgb(var(--phosphor-rgb))";
  const chipBg = isAccentCategory
    ? "rgba(var(--phosphor-rgb),0.09)"
    : `${color}15`;
  const chipBorder = isAccentCategory
    ? "rgba(var(--phosphor-rgb),0.2)"
    : `${color}25`;
  const status = statusColors[project.status] || statusColors.completed;
  const openDetails = () => navigate(`/projects/${project._id}`);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      role="button"
      tabIndex={0}
      className="group glass rounded-2xl border border-border-1 hover:border-white/12
                 transition-all duration-500 hover:shadow-card-hover cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Top accent */}
      <div
        className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              color: color,
              background: chipBg,
              border: `1px solid ${chipBorder}`,
            }}
          >
            {project.category}
          </span>
          <span
            className="text-xs font-mono px-2 py-1 rounded-full flex-shrink-0"
            style={{ color: status.text, background: status.bg }}
          >
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-white leading-tight mb-3">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1">
          {project.description.length > 150
            ? project.description.slice(0, 150) + "…"
            : project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 6).map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
          {project.techStack.length > 6 && (
            <span className="tag">+{project.techStack.length - 6}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-border-1">
          {project.githubLink ? (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-mono text-white/35 hover:text-white transition-colors duration-200"
            >
              <Github className="w-3.5 h-3.5" />
              Code
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono text-white/15">
              <Github className="w-3.5 h-3.5" />
              Private
            </span>
          )}

          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-mono text-white/35 hover:text-phosphor transition-colors duration-200 ml-auto"
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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = async ({ withSpinner = true } = {}) => {
    if (withSpinner) {
      setLoading(true);
    }

    try {
      setError("");
      const res = await projectsAPI.getAll();
      const nextProjects = res.data?.data || [];
      setProjects(nextProjects);
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(nextProjects));
    } catch (err) {
      const msg = err.response?.data?.message || "Could not load projects.";
      setError(msg);
      const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
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
    const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
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

    fetchProjects({ withSpinner: !cached });
  }, []);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="section-label">
            <span className="w-2 h-2 rounded-full bg-phosphor" />
            Portfolio
          </span>
          <h1 className="section-heading text-white mb-4">
            All <span className="text-gradient-phosphor">Projects</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl">
            A collection of work spanning full-stack applications, developer
            tools, and open-source contributions.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-phosphor text-void font-semibold"
                    : "glass text-white/50 hover:text-white border border-border-1 hover:border-white/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 w-full sm:w-64"
            />
          </div>
        </motion.div>

        {/* Count */}
        <p className="text-xs font-mono text-white/25 mb-6">
          {loading
            ? "Loading projects..."
            : `${filtered.length} project${filtered.length !== 1 ? "s" : ""}${activeCategory !== "all" ? ` in ${activeCategory}` : ""}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 text-phosphor animate-spin" />
          </div>
        ) : error && projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-white/45 mb-4">{error}</p>
            <button
              onClick={() => fetchProjects()}
              className="text-sm text-phosphor hover:underline"
            >
              Retry loading projects
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white/40">
              No projects found matching your criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 text-sm text-phosphor hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-4 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                Showing cached projects while we retry the latest data.
              </div>
            )}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
