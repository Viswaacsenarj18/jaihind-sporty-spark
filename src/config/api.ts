/**
 * Centralized API Configuration
 * Change API_BASE_URL to switch between localhost and production
 */

// ✅ Production API (Render)
export const API_BASE_URL = "https://jaihind-sporty-spark-1.onrender.com";

// 🔄 Uncomment below for local development
// export const API_BASE_URL = "http://localhost:5000";

/**
 * API Endpoints
 * Usage: import { AUTH_ROUTES, PRODUCT_ROUTES, ORDER_ROUTES, ADMIN_ROUTES } from "@/config/api"
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
  UPDATE_STATUS: (orderId: string) => `${API_BASE_URL}/api/orders/status/${orderId}`,
};

/**
 * Helper function for API requests with error handling
 */
export const apiCall = async (
  url: string,
  options?: RequestInit
): Promise<any> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
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
