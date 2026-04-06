/**
 * pages/admin/AdminMessages.jsx — Contact messages inbox for admin.
 *
 * WHAT: Lists all contact form submissions with read/unread state,
 *       expandable message detail panel, and delete capability.
 *
 * HOW:  Fetches paginated messages from GET /api/contact (protected).
 *       Clicking a message marks it as read and opens a detail view.
 *       Delete calls DELETE /api/contact/:id with confirmation.
 *
 * WHY:  A proper inbox UI lets the admin manage messages without
 *       needing to access MongoDB directly.
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MailOpen, Trash2, X, Loader2, Inbox,
  RefreshCw, AlertTriangle, Calendar, AtSign
} from "lucide-react";
import toast from "react-hot-toast";
import { contactAPI } from "../../utils/api";

function DeleteConfirm({ onCancel, onConfirm, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-void-2 border border-border-2 rounded-2xl p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-display font-semibold text-white mb-2">Delete Message</h3>
        <p className="text-sm text-white/50 mb-6">This will permanently delete the message. This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 justify-center flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all"); // all | unread
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await contactAPI.getAll({
        page,
        limit: 20,
        ...(filter === "unread" && { unread: true }),
      });
      setMessages(res.data.data || []);
      setPagination(res.data.pagination || {});
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleSelectMessage = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      try {
        await contactAPI.markRead(msg._id);
        setMessages((msgs) => msgs.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await contactAPI.delete(deleteTarget._id);
      toast.success("Message deleted.");
      setMessages((msgs) => msgs.filter((m) => m._id !== deleteTarget._id));
      if (selectedMsg?._id === deleteTarget._id) setSelectedMsg(null);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete message.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <>
      <div className="space-y-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white mb-1">
              Messages
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-phosphor/20 text-phosphor border border-phosphor/30">
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="text-sm text-white/40">{pagination.total || 0} total messages</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex gap-1 p-1 glass rounded-lg border border-border-1">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors duration-200 capitalize ${
                    filter === f ? "bg-phosphor/20 text-phosphor" : "text-white/40 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              className="w-9 h-9 glass rounded-lg border border-border-1 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: "500px" }}>
          {/* Message List */}
          <div className="lg:col-span-2 glass rounded-2xl border border-border-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center flex-1 py-16">
                <Loader2 className="w-7 h-7 text-phosphor animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16">
                <Inbox className="w-10 h-10 text-white/15 mb-3" />
                <p className="text-white/35 text-sm">
                  {filter === "unread" ? "No unread messages." : "No messages yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-1 overflow-y-auto flex-1">
                {messages.map((msg) => (
                  <motion.button
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left px-4 py-4 hover:bg-surface-2 transition-colors duration-200 flex items-start gap-3 ${
                      selectedMsg?._id === msg._id ? "bg-surface-2 border-l-2 border-phosphor" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {msg.isRead
                        ? <MailOpen className="w-4 h-4 text-white/25" />
                        : <Mail className="w-4 h-4 text-phosphor" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-sm truncate ${msg.isRead ? "text-white/60 font-normal" : "text-white font-semibold"}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs font-mono text-white/25 flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${msg.isRead ? "text-white/30" : "text-white/55"}`}>
                        {msg.subject || msg.message}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-xs font-mono text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-xs font-mono text-white/25">
                  {page} / {pagination.pages}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs font-mono text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3 glass rounded-2xl border border-border-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedMsg ? (
                <motion.div
                  key={selectedMsg._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex flex-col"
                >
                  {/* Detail header */}
                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border-1">
                    <div>
                      <h2 className="font-display font-semibold text-white text-lg mb-1">
                        {selectedMsg.subject || "(No subject)"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="text-white/60 font-semibold">{selectedMsg.name}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <AtSign className="w-3 h-3" />
                          <a href={`mailto:${selectedMsg.email}`} className="hover:text-phosphor transition-colors">
                            {selectedMsg.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(selectedMsg.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setDeleteTarget(selectedMsg)}
                        className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedMsg(null)}
                        className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-colors lg:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMsg.message}
                    </p>
                  </div>

                  {/* Reply action */}
                  <div className="px-6 py-4 border-t border-border-1">
                    <a
                      href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || "Your message"}`}
                      className="btn-primary text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-24 text-center"
                >
                  <MailOpen className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/30 text-sm">Select a message to read it</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
