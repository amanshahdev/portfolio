/**
 * HeroSection.jsx — Full-viewport hero with animated intro.
 *
 * WHAT: The first thing visitors see — name, animated role titles,
 *       CTA buttons, and decorative background elements.
 *
 * HOW:  TypeAnimation cycles through role titles. Framer Motion staggers
 *       the content reveal. Background orbs use CSS keyframe animations.
 *       A grid overlay adds depth.
 *
 * WHY:  A compelling hero section immediately communicates who you are
 *       and creates a memorable first impression.
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "40+", label: "Projects Shipped" },
  { value: "20+", label: "Happy Clients" },
  { value: "∞", label: "Lines of Code" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* ── Background elements ──────────────────────────────────────── */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Orbs */}
      <div
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-none mb-4">
              Hi, I'm{" "}
              <span className="relative inline-block">
                <span className="text-gradient-phosphor">Aman Shah</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-phosphor to-phosphor-dim"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Animated role */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="text-2xl md:text-3xl lg:text-4xl font-display text-white/50 flex items-center gap-3 flex-wrap">
              <span>I build full stack applications</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link to="/projects" className="btn-primary group">
              View My Work
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Let's Talk
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-2"
          >
            <span className="text-xs font-mono text-white/25 tracking-widest uppercase">
              Connect
            </span>
            <div className="flex-1 h-px bg-border-1" />
            {[
              {
                icon: Github,
                href: "https://github.com/amanshahdev",
                label: "GitHub",
              },
              {
                icon: Linkedin,
                href: "https://www.linkedin.com/in/amanshah-dev/",
                label: "LinkedIn",
              },
              {
                icon: Mail,
                href: "mailto:amanshah.dev@gmail.com",
                label: "Email",
              },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-phosphor hover:border-phosphor/30 transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
