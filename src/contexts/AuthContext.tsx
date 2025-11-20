import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI, adminAPI } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Restore user from localStorage on app load (don't clear!)
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('🔄 Restoring session from localStorage:', userData.email);
        setUser(userData);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastPage');
      }
    } else {
      console.log('ℹ️ No saved session found');
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const data = response.data as any;
      
      // Debug: Log the actual response structure
      console.log('Login Response:', JSON.stringify(data, null, 2));
      
      // Handle different response formats from backend
      // Auth returns: { message, data: { id, name, email, role, token } }
      let token = data.data?.token || data.token;
      let user = data.data || data.user;
      
      // Ensure user object has required fields
      if (!user || !user.id || !user.email) {
        console.error('Invalid user object:', user);
        throw new Error('Invalid user data from server');
      }
      
      if (!token) {
        console.error('No token found in response:', data);
        throw new Error('No authentication token received');
      }
      
      // Map backend fields to our User interface
      const userData = {
        id: user.id || user._id,
        name: user.name || 'User',
        email: user.email,
        role: user.role || 'user'
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMsg);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await authAPI.register({ name, email, password, phone });
      const data = response.data as any;
      
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      
      toast.success('Account created successfully! Please log in.');
      // Don't auto-login after register - let user manually login
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMsg);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await adminAPI.login(email, password);
      const data = response.data as any;
      
      // Debug: Log the actual response structure
      console.log('Admin Login Response:', JSON.stringify(data, null, 2));
      
      // Handle different response formats from backend
      // Admin returns: { success, message, token, data: { id, name, email, role } }
      let token = data.token;
      let user = data.data;
      
      // Ensure user object has required fields
      if (!user || !user.id || !user.email) {
        console.error('Invalid user object:', user);
        throw new Error('Invalid user data from server');
      }
      
      if (!token) {
        console.error('No token found in response:', data);
        throw new Error('No authentication token received');
      }
      
      // Map backend fields to our User interface
      const userData = {
        id: user.id || user._id,
        name: user.name || 'Admin',
        email: user.email,
        role: user.role || 'admin'
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Admin logged in successfully!');
    } catch (error: any) {
      console.error('Admin login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Admin login failed';
      toast.error(errorMsg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
