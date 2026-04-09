/**
 * AdminLayout.jsx — Shell layout for admin panel pages.
 *
 * WHAT: Renders the admin sidebar nav and content area for dashboard,
 *       projects management, and messages inbox.
 *
 * HOW:  Uses React Router <Outlet /> for child page content. Sidebar
 *       collapses to icons on mobile. Reads unread message count for
 *       the badge on the Messages nav item.
 *
 * WHY:  Consistent admin chrome lets each admin page focus purely on
 *       its feature without reimplementing nav.
 */
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  LogOut,
  Terminal,
  Menu,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { path: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-void flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-void-1 border-r border-border-1
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-phosphor/10 border border-phosphor/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-phosphor" />
            </div>
            <div>
              <div className="font-display font-semibold text-sm text-white">
                Admin Panel
              </div>
              <div className="text-xs text-white/30 font-mono">
                amanshah.dev
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-phosphor-glow text-phosphor border border-phosphor/20"
                    : "text-white/50 hover:text-white hover:bg-surface-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-phosphor" : ""}`}
                  />
                  {label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-1 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-white/40 hover:text-phosphor transition-colors rounded-lg hover:bg-surface-1"
            type="button"
          >
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-surface-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Portfolio
          </a>
          <div className="px-3 py-2 rounded-lg bg-surface-1">
            <div className="text-xs font-mono text-white/40 truncate">
              {user?.email}
            </div>
            <div className="text-xs text-white/20 mt-0.5">Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border-1 bg-void-1">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg glass"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="font-display font-semibold text-sm text-white">
            Admin Panel
          </span>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg glass text-white/70"
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
