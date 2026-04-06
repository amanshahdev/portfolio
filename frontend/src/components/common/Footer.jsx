/**
 * Footer.jsx — Site footer with social links and copyright.
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Terminal, ArrowUpRight } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/amanshahdev", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/amanshah-dev/",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:amanshah.dev@gmail.com", label: "Email" },
];

const footerNav = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border-1 bg-void-1/50 mt-20">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-phosphor/20 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-phosphor/10 border border-phosphor/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-phosphor" />
              </div>
              <span className="font-display font-semibold text-white">
                aman<span className="text-phosphor">shah</span>.dev
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Building exceptional digital experiences with clean code and
              thoughtful design.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {footerNav.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/50 hover:text-phosphor transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
              Connect
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="w-9 h-9 rounded-lg glass border-border-1 flex items-center justify-center text-white/40 hover:text-phosphor hover:border-phosphor/30 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © {new Date().getFullYear()} Aman Shah. Crafted with React & Node.js
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-phosphor animate-pulse" />
            <span className="text-xs font-mono text-white/25">
              Available for opportunities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
