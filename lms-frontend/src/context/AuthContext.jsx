import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create context
export const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);




  /**
   * Check authentication status
   * Called on app load to restore session
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await authService.me();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Resolves with user data
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Set user data
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Logout function
   * Clears user data and token
   */
  const logout = async () => {
    try {
      // Call backend logout (optional, to invalidate token)
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data regardless of API call result
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
