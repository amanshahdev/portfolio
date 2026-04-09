/**
 * App.jsx — Root component with React Router setup.
 *
 * WHAT: Defines all application routes and wraps the app in providers
 *       (AuthProvider, Toaster).
 *
 * HOW:  Uses React Router v6 BrowserRouter. Public routes render the main
 *       layout with Navbar + Footer. Admin routes use the AdminLayout.
 *       ProtectedRoute guards admin-only paths.
 *
 * WHY:  Centralised routing makes navigation logic easy to audit and
 *       modify without touching individual page components.
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/common/MainLayout";
import AdminLayout from "./components/common/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PageLoader from "./components/common/PageLoader";

// ── Lazy-loaded pages ──────────────────────────────────────────────────────
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--toast-bg)",
                color: "var(--toast-text)",
                border: "1px solid var(--toast-border)",
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "var(--phosphor)",
                  secondary: "var(--toast-bg)",
                },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "var(--toast-bg)" },
              },
            }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public Portfolio Routes ──────────────────────────── */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* ── Admin Routes ─────────────────────────────────────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>

              {/* ── 404 ──────────────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
