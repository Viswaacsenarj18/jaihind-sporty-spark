/**
 * 🌐 Centralized API Configuration
 * Automatically switches between localhost (development) and Render (production)
 */

// Detect environment based on the browser origin
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// ✅ Use Render backend in production
export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000" // Local development
  : "https://jaihind-sporty-spark-1.onrender.com"; // Render backend

/**
 * ✅ API Endpoints
 */
export const AUTH_ROUTES = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  GET_USERS: `${API_BASE_URL}/api/auth/users`,
};

export const ADMIN_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  PROFILE: `${API_BASE_URL}/api/admin/profile`,
};

export const PRODUCT_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/products`,
  ADD: `${API_BASE_URL}/api/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/api/products/${id}`,
};

export const ORDER_ROUTES = {
  GET_ALL: `${API_BASE_URL}/api/orders`,
  CREATE: `${API_BASE_URL}/api/orders/create`,
  GET_USER: (userId: string) => `${API_BASE_URL}/api/orders/user/${userId}`,
  UPDATE_STATUS: (orderId: string) =>
    `${API_BASE_URL}/api/orders/status/${orderId}`,
};

/**
 * 🧩 Helper for API requests with proper error handling
 */
export const apiCall = async (url: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include", // ✅ Include cookies for authentication
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

export default API_BASE_URL;
