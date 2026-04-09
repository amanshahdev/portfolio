/**
 * pages/admin/AdminProjects.jsx — Full project CRUD management page.
 *
 * WHAT: Lists all projects in a table with edit/delete actions.
 *       Opens a modal form for creating and editing projects.
 *
 * HOW:  Fetches projects on mount. Add/Edit share the same ProjectForm
 *       modal component. Delete shows an inline confirmation.
 *       All mutations call the projectsAPI and refresh the list.
 *
 * WHY:  A single page for all CRUD keeps admin navigation simple
 *       and reduces round-trips between routes.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  StarOff,
  ExternalLink,
  Github,
  FolderOpen,
  Save,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { projectsAPI } from "../../utils/api";

const EMPTY_PROJECT = {
  title: "",
  description: "",
  shortDescription: "",
  techStack: [],
  githubLink: "",
  liveLink: "",
  imageUrl: "",
  category: "fullstack",
  featured: false,
  status: "completed",
};

const CATEGORIES = ["fullstack", "frontend", "backend", "mobile", "other"];
const STATUSES = ["completed", "in-progress", "archived"];

// ── Project Form Modal ─────────────────────────────────────────────────────
function ProjectFormModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project || EMPTY_PROJECT);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!project?._id;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.techStack.length === 0)
      e.techStack = "Add at least one technology";
    if (form.githubLink && !/^https?:\/\/.+/.test(form.githubLink))
      e.githubLink = "Must be a valid URL";
    if (form.liveLink && !/^https?:\/\/.+/.test(form.liveLink))
      e.liveLink = "Must be a valid URL";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, t] }));
      if (errors.techStack) setErrors((e) => ({ ...e, techStack: "" }));
    }
    setTechInput("");
  };

  const removeTech = (tech) => {
    setForm((f) => ({
      ...f,
      techStack: f.techStack.filter((t) => t !== tech),
    }));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
    if (e.key === "," && techInput.trim()) {
      e.preventDefault();
      addTech();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await projectsAPI.update(project._id, form);
        toast.success("Project updated successfully!");
      } else {
        await projectsAPI.create(form);
        toast.success("Project created successfully!");
      }
      onSave();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save project.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-void-2 border border-border-2 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-glass"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-1 sticky top-0 bg-void-2 z-10">
          <h2 className="font-display font-semibold text-white">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className={`input-field ${errors.title ? "ring-1 ring-red-500/50" : ""}`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
              Short Description
            </label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="One-liner summary for cards..."
              className="input-field"
              maxLength={200}
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
              Full Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed project description..."
              className={`input-field resize-none ${errors.description ? "ring-1 ring-red-500/50" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-void-2">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-void-2">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
              Tech Stack *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                placeholder="React, Node.js... (Enter or comma to add)"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addTech}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
            {errors.techStack && (
              <p className="text-xs text-red-400 mb-2">{errors.techStack}</p>
            )}
            {form.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 tag text-xs"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                GitHub URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className={`input-field pl-9 ${errors.githubLink ? "ring-1 ring-red-500/50" : ""}`}
                />
              </div>
              {errors.githubLink && (
                <p className="text-xs text-red-400 mt-1">{errors.githubLink}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                Live URL
              </label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  name="liveLink"
                  value={form.liveLink}
                  onChange={handleChange}
                  placeholder="https://myproject.com"
                  className={`input-field pl-9 ${errors.liveLink ? "ring-1 ring-red-500/50" : ""}`}
                />
              </div>
              {errors.liveLink && (
                <p className="text-xs text-red-400 mt-1">{errors.liveLink}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
              Image URL
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="input-field"
            />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.featured ? "bg-phosphor" : "bg-surface-3"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-void transition-transform duration-200 ${form.featured ? "translate-x-5" : "translate-x-0"}`}
              />
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="sr-only"
              />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              Feature this project on the home page
            </span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-1">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────────────────────
function DeleteConfirm({ project, onCancel, onConfirm, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-void-2 border border-border-2 rounded-2xl p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-display font-semibold text-white mb-2">
          Delete Project
        </h3>
        <p className="text-sm text-white/50 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">"{project.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-ghost flex-1 justify-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 justify-center flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null); // null=closed, false=new, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await projectsAPI.delete(deleteTarget._id);
      toast.success("Project deleted.");
      setDeleteTarget(null);
      fetchProjects();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const categoryColors = {
    fullstack: "#00ff88",
    frontend: "#38bdf8",
    backend: "#a855f7",
    mobile: "#f59e0b",
    other: "#6b7280",
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white mb-1">
              Projects
            </h1>
            <p className="text-sm text-white/40">
              {projects.length} total project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setModalProject(false)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-border-1 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-7 h-7 text-phosphor animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center">
              <FolderOpen className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/35 text-sm">No projects yet.</p>
              <button
                onClick={() => setModalProject(false)}
                className="mt-4 btn-secondary text-sm"
              >
                <Plus className="w-4 h-4" />
                Create your first project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-1">
                    <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest hidden lg:table-cell">
                      Tech Stack
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">
                      Featured
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-1">
                  {projects.map((project) => {
                    const color = categoryColors[project.category] || "#6b7280";
                    return (
                      <tr
                        key={project._id}
                        className="hover:bg-surface-1 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm text-white leading-tight">
                            {project.title}
                          </div>
                          <div className="text-xs text-white/30 mt-0.5 hidden sm:block">
                            {project.description.slice(0, 60)}…
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span
                            className="text-xs font-mono px-2 py-1 rounded-full"
                            style={{
                              color,
                              background: `${color}15`,
                              border: `1px solid ${color}25`,
                            }}
                          >
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.slice(0, 3).map((t) => (
                              <span key={t} className="tag text-xs">
                                {t}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="tag text-xs">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span
                            className={`text-xs font-mono ${project.status === "completed" ? "text-phosphor" : project.status === "in-progress" ? "text-plasma" : "text-white/30"}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {project.featured ? (
                            <Star className="w-4 h-4 text-plasma mx-auto" />
                          ) : (
                            <StarOff className="w-4 h-4 text-white/15 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalProject(project)}
                              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(project)}
                              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalProject !== null && (
          <ProjectFormModal
            project={modalProject || null}
            onClose={() => setModalProject(null)}
            onSave={() => {
              setModalProject(null);
              fetchProjects();
            }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            project={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
