import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor: Add token & handle FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token added to request:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  
  // ✅ Handle FormData - let axios set proper multipart/form-data header
  if (config.data instanceof FormData) {
    console.log('📤 FormData detected - removing Content-Type to allow axios to set multipart/form-data');
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
};

// Admin API
export const adminAPI = {
  login: (email: string, password: string) =>
    api.post('/admin/login', { email, password }),
  getProfile: () => api.get('/admin/profile'),
  getStats: () => api.get('/admin/stats'), // ✅ Public stats endpoint
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => {
    // ✅ Handle FormData for file uploads
    if (data instanceof FormData) {
      console.log('📤 Uploading product with FormData');
      return api.post('/products', data);
    }
    return api.post('/products', data);
  },
  update: (id: string, data: any) => {
    // ✅ Handle FormData for file uploads
    if (data instanceof FormData) {
      console.log('📤 Updating product with FormData');
      return api.put(`/products/${id}`, data);
    }
    return api.put(`/products/${id}`, data);
  },
  delete: (id: string) => api.delete(`/products/${id}`),
};

export default api;

