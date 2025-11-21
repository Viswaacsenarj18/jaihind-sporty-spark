// src/lib/api.ts
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===========================================================
// REQUEST INTERCEPTOR (TOKEN + FORMDATA HANDLING)
// ===========================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData (axios will add correct boundary)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// ===========================================================
// AUTH API
// ===========================================================
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => api.post("/auth/register", data),
};

// ===========================================================
// ADMIN API
// ===========================================================
export const adminAPI = {
  login: (email: string, password: string) =>
    api.post("/admin/login", { email, password }),

  getProfile: () => api.get("/admin/profile"),

  // ⭐ PUBLIC STATS ENDPOINT
  getStats: () => api.get("/admin/stats"),
};

// ===========================================================
// PRODUCTS API
// ===========================================================
export const productsAPI = {
  getAll: () => api.get("/products"),

  getById: (id: string) => api.get(`/products/${id}`),

  create: (data: any) => {
    if (data instanceof FormData) {
      // Let axios handle multipart
      return api.post("/products", data);
    }
    return api.post("/products", data);
  },

  update: (id: string, data: any) => {
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data);
    }
    return api.put(`/products/${id}`, data);
  },

  delete: (id: string) => api.delete(`/products/${id}`),
};

export default api;
