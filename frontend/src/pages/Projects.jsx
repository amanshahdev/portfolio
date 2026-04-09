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
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Loader2, Search, Filter } from "lucide-react";
import { projectsAPI } from "../utils/api";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
];

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

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const color = categoryColors[project.category] || "#00ff88";
  const status = statusColors[project.status] || statusColors.completed;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group glass rounded-2xl border border-border-1 hover:border-white/12
                 transition-all duration-500 hover:shadow-card-hover flex flex-col overflow-hidden"
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
              background: `${color}15`,
              border: `1px solid ${color}25`,
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    projectsAPI
      .getAll()
      .then((res) => setProjects(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
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
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "all" && ` in ${activeCategory}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 text-phosphor animate-spin" />
          </div>
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
        )}
      </div>
    </div>
  );
}
