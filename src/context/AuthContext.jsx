"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Create the auth context
const AuthContext = createContext({});

// Create the auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simple function to log session data for debugging
  const logSessionData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const data = {
        token: sessionStorage.getItem('authToken') ? 'Present' : 'None',
        userId: sessionStorage.getItem('userId'),
        userName: sessionStorage.getItem('userName'), 
        userRole: sessionStorage.getItem('userRole')
      };
      console.log("Session data:", data);
      return data;
    } catch (e) {
      console.error("Error reading session data:", e);
      return null;
    }
  };

  // Load user on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        // Check both cookie and sessionStorage
        const tokenFromCookie = Cookies.get('authToken');
        const tokenFromSession = sessionStorage.getItem('authToken');
        
       
        
        const token = tokenFromCookie || tokenFromSession;
        
        if (token) {
          // If we have a token in either place, make sure it's in both places
          if (tokenFromCookie && !tokenFromSession) {
            sessionStorage.setItem('authToken', tokenFromCookie);
          } else if (tokenFromSession && !tokenFromCookie) {
            Cookies.set('authToken', tokenFromSession, { expires: 7 });
          }
          
          // Get user data from sessionStorage
          const userId = sessionStorage.getItem('userId');
          const userName = sessionStorage.getItem('userName');
          const userRole = sessionStorage.getItem('userRole');
          
          if (userId) {
            setUser({
              id: userId,
              name: userName || 'User',
              role: userRole || 'user'
            });
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function - stores user data and updates state
  const login = (userData) => {
    console.log("Login called with:", userData);
    
    if (!userData || !userData.token || !userData.user) {
      console.error("Invalid login data", userData);
      return;
    }
    
    try {
      // Store in sessionStorage
      sessionStorage.setItem('authToken', userData.token);
      sessionStorage.setItem('userId', userData.user.id);
      sessionStorage.setItem('userName', userData.user.name || 'User');
      sessionStorage.setItem('userRole', userData.user.role || 'user');
      
      // CRITICAL: Store auth token in cookie for middleware with production-friendly settings
      Cookies.set('authToken', userData.token, { 
        expires: 7,
        path: '/',
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
     
      
      // Update state
      setUser(userData.user);
    } catch (error) {
      console.error("Error in login:", error);
    }

    console.log("After login attempt:");
    console.log("Cookie exists:", !!Cookies.get('authToken'));
    console.log("Session storage:", {
      authToken: !!sessionStorage.getItem('authToken'),
      userId: sessionStorage.getItem('userId')
    });
  };

  // Logout function - clears storage and state
  const logout = () => {
    // Clear both sessionStorage and cookies
    sessionStorage.clear();
    
    // Remove cookie with the same settings used to set it
    Cookies.remove('authToken', { 
      path: '/',
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Update state
    setUser(null);
    
    // Use window.location for a full page refresh instead of Next.js router
    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 