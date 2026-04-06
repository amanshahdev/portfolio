/**
 * pages/admin/AdminDashboard.jsx — Admin overview dashboard.
 *
 * WHAT: Shows stat cards (project count, message count, unread count),
 *       recent messages, and quick-action buttons.
 *
 * HOW:  Fetches project and contact counts in parallel. Renders animated
 *       stat cards and a preview table of the latest messages.
 *
 * WHY:  Gives the admin an at-a-glance view of portfolio activity
 *       without navigating to individual sections.
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderOpen, MessageSquare, Mail, Eye, ArrowRight,
  Loader2, Plus, TrendingUp
} from "lucide-react";
import { projectsAPI, contactAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function StatCard({ icon: Icon, label, value, color, loading, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-6 border border-border-1 hover:border-white/12 transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <TrendingUp className="w-4 h-4 text-white/15" />
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-surface-2 rounded animate-pulse" />
      ) : (
        <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
      )}
      <div className="text-sm text-white/40">{label}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    featuredProjects: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, messagesRes] = await Promise.all([
          projectsAPI.getAll(),
          contactAPI.getAll({ limit: 5 }),
        ]);

        const projects = projectsRes.data.data || [];
        const msgs = messagesRes.data;

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.featured).length,
          totalMessages: msgs.pagination?.total || 0,
          unreadMessages: msgs.unreadCount || 0,
        });
        setRecentMessages(msgs.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FolderOpen, label: "Total Projects", value: stats.totalProjects, color: "#00ff88", delay: 0 },
    { icon: TrendingUp, label: "Featured Projects", value: stats.featuredProjects, color: "#a855f7", delay: 0.05 },
    { icon: MessageSquare, label: "Total Messages", value: stats.totalMessages, color: "#38bdf8", delay: 0.1 },
    { icon: Mail, label: "Unread Messages", value: stats.unreadMessages, color: "#f59e0b", delay: 0.15 },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-semibold text-white mb-1">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-white/40">
          Here's what's happening with your portfolio today.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="lg:col-span-2 glass rounded-2xl border border-border-1 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-1">
            <h2 className="font-display font-semibold text-white text-sm">Recent Messages</h2>
            <Link
              to="/admin/messages"
              className="text-xs font-mono text-phosphor hover:text-phosphor-dim flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-1 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="px-6 py-12 text-center text-white/30 text-sm">
              No messages yet.
            </div>
          ) : (
            <div className="divide-y divide-border-1">
              {recentMessages.map((msg) => (
                <Link
                  key={msg._id}
                  to="/admin/messages"
                  className="flex items-start gap-4 px-6 py-4 hover:bg-surface-1 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white truncate">{msg.name}</span>
                      {!msg.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-phosphor flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{msg.subject || msg.message}</p>
                  </div>
                  <span className="text-xs text-white/25 font-mono flex-shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass rounded-2xl border border-border-1 p-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-white text-sm mb-6">Quick Actions</h2>

          <Link
            to="/admin/projects"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-phosphor/10 border border-phosphor/20 flex items-center justify-center group-hover:bg-phosphor/20 transition-colors">
              <Plus className="w-4 h-4 text-phosphor" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Add Project</div>
              <div className="text-xs text-white/30">Create a new portfolio project</div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
          </Link>

          <Link
            to="/admin/messages"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-aurora/10 border border-aurora/20 flex items-center justify-center group-hover:bg-aurora/20 transition-colors">
              <Eye className="w-4 h-4 text-aurora-2" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">View Messages</div>
              <div className="text-xs text-white/30">
                {stats.unreadMessages > 0
                  ? `${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? "s" : ""}`
                  : "All caught up!"}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-ice/10 border border-ice/20 flex items-center justify-center group-hover:bg-ice/20 transition-colors">
              <Eye className="w-4 h-4 text-ice" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Preview Portfolio</div>
              <div className="text-xs text-white/30">See how visitors see your site</div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
