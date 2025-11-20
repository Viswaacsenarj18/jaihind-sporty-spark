/**
 * 🌐 Centralized API Configuration (Fixed Version)
 * Automatically switches between localhost (development) and Render (production)
 */

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// 🔥 IMPORTANT: Your REAL backend URL on Render
export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000" // Local development - backend always on 5000
  : "https://jaihind-sporty-spark-backend.onrender.com"; // Production backend

console.log("🌐 API_BASE_URL:", API_BASE_URL);
console.log("📍 Frontend hostname:", typeof window !== "undefined" ? window.location.hostname : "server-side");
console.log("📍 Frontend port:", typeof window !== "undefined" ? window.location.port : "N/A");

/**
 * 🛡 Auth Routes
 */
export const AUTH_ROUTES = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  GET_USERS: `${API_BASE_URL}/api/auth/users`,
};

/**
 * 👨‍💼 Admin Routes
 */
export const ADMIN_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  PROFILE: `${API_BASE_URL}/api/admin/profile`,
};

/**
 * 🛒 Product Routes
 */
export const PRODUCT_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/products`,
  ADD: `${API_BASE_URL}/api/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
};

/**
 * 📂 Category Routes
 */
export const CATEGORY_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/categories`,
  GET_ONE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  ADD: `${API_BASE_URL}/api/categories`,
  UPDATE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
};

/**
 * 📦 Order Routes
 * (fixed: /api/orders/create was wrong for your backend)
 */
export const ORDER_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/orders`,
  CREATE: `${API_BASE_URL}/api/orders`, // FIXED (POST /api/orders)
  GET_USER: (userId: string) => `${API_BASE_URL}/api/orders/user/${userId}`,
  UPDATE_STATUS: (orderId: string) =>
    `${API_BASE_URL}/api/orders/status/${orderId}`,
};

/**
 * 🧩 Helper API caller with full error handling
 */
export const apiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include", // Allows cookies/JWT
      body: options.body || null,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `API Error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export default API_BASE_URL;
