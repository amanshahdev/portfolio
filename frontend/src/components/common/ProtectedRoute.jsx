/**
 * ProtectedRoute.jsx — Guards admin routes behind JWT authentication.
 *
 * WHAT: Wraps protected routes; redirects unauthenticated visitors to /admin/login.
 * HOW:  Reads isAuthenticated from AuthContext. Shows a loader while the
 *       context is still initialising (prevents flash-redirect on page refresh).
 * WHY:  Centralised guard means individual admin pages don't need auth checks.
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "./PageLoader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
