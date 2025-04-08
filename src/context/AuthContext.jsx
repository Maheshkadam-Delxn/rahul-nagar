"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = Cookies.get('authToken');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Get user data from cookies
        const userId = Cookies.get('userId');
        const userName = Cookies.get('userName');
        const userRole = Cookies.get('userRole');

        if (userId) {
          setUser({
            id: userId,
            name: userName || 'User',
            role: userRole || 'user'
          });
        } else {
          // If cookies don't have user data but token exists
          // Fetch user data from your API
          const userData = await fetchUserData(token);
          if (userData) {
            setUser(userData);
            // Update cookies with fresh data
            Cookies.set('userId', userData.id, { expires: 30 });
            Cookies.set('userName', userData.name, { expires: 30 });
            Cookies.set('userRole', userData.role, { expires: 30 });
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid auth data
          Cookies.remove('authToken', { path: '/' });
          Cookies.remove('userId', { path: '/' });
          Cookies.remove('userName', { path: '/' });
          Cookies.remove('userRole', { path: '/' });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error);
      return null;
    }
  };

  const login = async (userData) => {
    try {
      // Clear any previous errors
      setError(null);
      
      // Store token and user data in cookies
      Cookies.set('authToken', userData.token, {
        expires: 30, // 30 days
        path: '/',
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('userId', userData.user.id, { expires: 30 });
      Cookies.set('userName', userData.user.name || 'User', { expires: 30 });
      Cookies.set('userRole', userData.user.role || 'user', { expires: 30 });

      // Update state
      setUser(userData.user);
    } catch (error) {
      console.error("Login error:", error);
      setError(error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Remove all auth cookies
      Cookies.remove('authToken', { path: '/' });
      Cookies.remove('userId', { path: '/' });
      Cookies.remove('userName', { path: '/' });
      Cookies.remove('userRole', { path: '/' });
      
      // Clear state
      setUser(null);
      setError(null);
      
      // Redirect to login
      router.push('/signin');
    } catch (error) {
      console.error("Logout error:", error);
      setError(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};