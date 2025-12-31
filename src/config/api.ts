/**
 * 🌐 Centralized API Configuration (Stable + Deployment Ready)
 * Automatically switches between localhost and production backend.
 */

const isBrowser = typeof window !== "undefined";

const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// 💡 Your backend URLs
const LOCAL_BACKEND = "http://localhost:5000";
const PRODUCTION_BACKEND = "https://jaihind-sporty-spark-backend.onrender.com";

// 🌐 Domain-based backend routing
let LIVE_BACKEND = PRODUCTION_BACKEND;

if (isBrowser) {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // For development/testing on custom domains, you can set via query param
  // e.g., ?apiBackend=http://localhost:5000
  const urlParams = new URLSearchParams(window.location.search);
  const customBackend = urlParams.get("apiBackend");
  
  if (customBackend) {
    LIVE_BACKEND = customBackend;
    console.log("🔧 Using custom backend from query param:", customBackend);
  } else if (hostname.includes("jaihindsports.in")) {
    // For production jaihindsports.in, use same domain
    // Make sure backend is running on same domain (via reverse proxy/deployment)
    LIVE_BACKEND = `${protocol}//${hostname}`;
    console.log("🌐 Using same-domain backend for jaihindsports.in");
  } else if (hostname.includes("jaihindsportsfit.in")) {
    // For jaihindsportsfit.in, use Render backend (or configure as needed)
    // You can change this to use same domain if backend is deployed there
    LIVE_BACKEND = PRODUCTION_BACKEND;
    console.log("🌐 Using Render backend for jaihindsportsfit.in");
  }
}

// 🌐 Final Base URL
export const API_BASE_URL = isLocalhost ? LOCAL_BACKEND : LIVE_BACKEND;

console.log("🌐 API_BASE_URL:", API_BASE_URL);

/**
 * ============================
 * 🚀 AUTH ROUTES
 * ============================
 */
export const AUTH_ROUTES = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  GET_USERS: `${API_BASE_URL}/api/auth/users`,
};

/**
 * ============================
 * 👨‍💼 ADMIN ROUTES
 * ============================
 */
export const ADMIN_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  PROFILE: `${API_BASE_URL}/api/admin/profile`,
  STATS: `${API_BASE_URL}/api/admin/stats`, // ⭐ IMPORTANT
};

/**
 * ============================
 * 🛒 PRODUCT ROUTES
 * ============================
 */
export const PRODUCT_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/products`,
  ADD: `${API_BASE_URL}/api/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  GET_ONE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
};

/**
 * ============================
 * 📂 CATEGORY ROUTES
 * ============================
 */
export const CATEGORY_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/categories`,
  ADD: `${API_BASE_URL}/api/categories`,
  GET_ONE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
};

/**
 * ============================
 * 📦 ORDER ROUTES
 * ============================
 */
export const ORDER_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/orders`,
  CREATE: `${API_BASE_URL}/api/orders`, // POST
  GET_USER: (userId: string) => `${API_BASE_URL}/api/orders/user/${userId}`,
  UPDATE_STATUS: (orderId: string) =>
    `${API_BASE_URL}/api/orders/status/${orderId}`,
};

/**
 * ============================
 * 🧩 Generic Fetch Wrapper
 * ============================
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
      credentials: "include", // Allow cookie/JWT
      body: options.body || null,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `API Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};

export default API_BASE_URL;
