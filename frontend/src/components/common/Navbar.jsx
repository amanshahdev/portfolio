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
            ? "py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "py-4 bg-black/70 md:bg-transparent md:py-5 border-b border-white/10 md:border-b-0"
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
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30"
              aria-label="Toggle menu"
              type="button"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[60px] z-[99] bg-black/90 border-b border-white/10 md:hidden pt-4 pb-4">
          <nav className="max-w-7xl mx-auto px-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-white bg-white/20"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                to="/admin/login"
                className="block px-4 py-3 text-xs font-mono text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-200 tracking-widest uppercase"
              >
                Admin Panel →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
