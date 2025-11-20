import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 🔄 usePagePersistence Hook
 * 
 * Tracks the current page and restores it on refresh
 * - Saves page when user is authenticated
 * - Restores page on app reload
 * - Ignores login/signup pages
 * - Only saves pages if user stays logged in
 */
export const usePagePersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // ✅ Save current page when user is logged in
  useEffect(() => {
    if (user && !loading) {
      // Don't save login/signup pages
      if (!location.pathname.includes('/login') && !location.pathname.includes('/signup')) {
        console.log('💾 Saving current page:', location.pathname);
        localStorage.setItem('lastPage', location.pathname);
      }
    }
  }, [location.pathname, user, loading]);

  // ✅ Redirect to saved page on app load if user is restored
  useEffect(() => {
    if (!loading && user) {
      const lastPage = localStorage.getItem('lastPage');
      
      // Only redirect if we're on the home page (fresh load)
      if (lastPage && location.pathname === '/' && lastPage !== '/') {
        console.log('📍 Restoring to last page:', lastPage);
        navigate(lastPage, { replace: true });
        localStorage.removeItem('lastPage'); // Clear after using
      }
    }
  }, [loading, user, navigate, location.pathname]);
};
