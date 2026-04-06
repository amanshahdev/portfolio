/**
 * PageLoader.jsx — Full-screen loading spinner for Suspense boundaries.
 */
import React from "react";
import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-phosphor border-r-phosphor/30" />
        </motion.div>
        <motion.p
          className="text-xs font-mono text-white/40 tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading
        </motion.p>
      </div>
    </div>
  );
}
