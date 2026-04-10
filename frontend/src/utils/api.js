/**
 * utils/api.js — Configured Axios instance for all backend requests.
 *
 * WHAT: Creates a pre-configured Axios client with the base URL, timeout,
 *       and request/response interceptors.
 *
 * HOW:  Request interceptor reads the JWT from localStorage and injects
 *       it as a Bearer token on every request. Response interceptor
 *       handles 401 (expired token) by clearing auth state and redirecting
 *       to the login page.
 *
 * WHY:  Centralising HTTP config means every component gets auth headers
 *       automatically — no manual token injection per call.
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("portfolio_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle auth errors ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to admin login
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      if (isAdminRoute && window.location.pathname !== "/admin") {
        localStorage.removeItem("portfolio_token");
        localStorage.removeItem("portfolio_user");
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  },
);

// ── Exported API methods ───────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params) => api.get("/projects", { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  reorder: (projects) => api.put("/projects/reorder", { projects }),
};

export const contactAPI = {
  submit: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  getOne: (id) => api.get(`/contact/${id}`),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const resumeAPI = {
  getCurrent: () => api.get("/resume"),
  upload: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
