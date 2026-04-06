/**
 * context/AuthContext.jsx — React Context for admin authentication state.
 *
 * WHAT: Provides isAuthenticated, user, login(), and logout() to the
 *       entire component tree via React Context.
 *
 * HOW:  On mount, reads persisted token + user from localStorage and
 *       validates the token with the backend. login() stores credentials;
 *       logout() clears them.
 *
 * WHY:  Centralised auth context avoids prop-drilling and keeps the
 *       ProtectedRoute component and admin nav badge in sync.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Validate stored token on app load ─────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("portfolio_token");
      const storedUser = localStorage.getItem("portfolio_user");

      if (token && storedUser) {
        try {
          // Verify token is still valid against the backend
          const res = await authAPI.getProfile();
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch {
          // Token invalid/expired — clear storage
          localStorage.removeItem("portfolio_token");
          localStorage.removeItem("portfolio_user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("portfolio_token", token);
    localStorage.setItem("portfolio_user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("portfolio_token");
    localStorage.removeItem("portfolio_user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
