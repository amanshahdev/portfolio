/**
 * Navbar.jsx — Simple mobile-responsive navigation bar.
 *
 * WHAT: Renders the site logo, desktop navigation links, and mobile hamburger menu.
 * HOW:  Uses React state for mobile menu toggle. Mobile menu shows/hides with conditional rendering.
 * WHY:  A clean, simple navbar that works reliably across all devices.
 */
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between min-h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-phosphor/10 border border-phosphor/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-phosphor" />
            </div>
            <span className="font-display font-semibold text-white tracking-tight text-sm md:text-base">
              aman<span className="text-phosphor">shah</span>.dev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-phosphor"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              className="ml-4 px-4 py-2 text-xs font-mono text-white/40 hover:text-phosphor transition-colors tracking-widest uppercase"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-phosphor/20 hover:bg-phosphor/30 text-white transition-colors border border-phosphor/30"
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
      </header>

      {/* Mobile Menu - Simple Conditional Rendering */}
      {mobileOpen && (
        <div className="fixed top-[60px] left-0 right-0 z-[99] bg-black/95 border-b border-white/10 md:hidden shadow-lg">
          <nav className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-phosphor/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Divider */}
            <div className="my-2 h-px bg-white/10" />

            {/* Admin Link */}
            <Link
              to="/admin/login"
              className="block px-4 py-3 text-xs font-mono text-white/50 hover:text-white hover:bg-white/10 transition-colors tracking-widest uppercase rounded-lg"
            >
              Admin Panel
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
