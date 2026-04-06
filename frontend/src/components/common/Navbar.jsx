/**
 * Navbar.jsx — Premium sticky navigation bar.
 *
 * WHAT: Renders the site logo, navigation links, and mobile hamburger menu.
 * HOW:  Uses Framer Motion for entrance animation and scroll-based background
 *       blur. Active route is highlighted with an animated underline indicator.
 *       Mobile menu slides in with AnimatePresence.
 * WHY:  A polished navbar sets the tone for the entire portfolio.
 */
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 w-full ${
          scrolled
            ? "py-3 bg-void/90 backdrop-blur-xl border-b border-border-1 shadow-lg"
            : "py-4 bg-void-1 md:bg-transparent md:py-5 border-b border-border-1/50 md:border-b-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-phosphor/10 border border-phosphor/30 flex items-center justify-center transition-all duration-300 group-hover:bg-phosphor/20 group-hover:shadow-phosphor">
              <Terminal className="w-4 h-4 text-phosphor" />
            </div>
            <span className="font-display font-semibold text-white tracking-tight hidden sm:inline">
              aman<span className="text-phosphor">shah</span>.dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-phosphor"
                      : "text-white/60 hover:text-white hover:bg-surface-1"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-phosphor"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <Link
              to="/admin/login"
              className="ml-4 px-4 py-2 text-xs font-mono text-white/30 hover:text-phosphor/70 transition-colors duration-200 tracking-widest uppercase"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-phosphor/10 border border-phosphor/20 text-white hover:bg-phosphor/20 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-[99] bg-void-1/95 backdrop-blur-xl border-b border-border-1 md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "text-phosphor bg-phosphor-glow"
                          : "text-white/60 hover:text-white hover:bg-surface-1"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-border-1">
                <Link
                  to="/admin/login"
                  className="block px-4 py-3 text-xs font-mono text-white/30 hover:text-phosphor/70 transition-colors duration-200 tracking-widest uppercase"
                >
                  Admin Panel →
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
