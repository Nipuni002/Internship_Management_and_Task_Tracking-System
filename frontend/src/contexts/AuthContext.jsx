import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { 
  getToken, 
  setToken, 
  getUser, 
  setUser as setStoredUser, 
  clearAuth 
} from '../utils/tokenStorage';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and restore session on application load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
        
        try {
          if (storedToken === 'mock-jwt-token-string') {
            // Keep sandbox session
            setUserState(storedUser);
          } else {
            // Verify real token validity by calling profile API
            const profileResponse = await authService.getCurrentUser();
            if (profileResponse.success && profileResponse.data) {
              const userData = profileResponse.data;
              if (userData.role && !userData.role.startsWith('ROLE_')) {
                userData.role = `ROLE_${userData.role}`;
              }
              setUserState(userData);
              setStoredUser(userData);
            } else {
              handleSessionExpired();
            }
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          if (storedToken === 'mock-jwt-token-string') {
            setUserState(storedUser);
          } else if (error.response && error.response.status === 401) {
            handleSessionExpired();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleSessionExpired = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    toast.error('Session expired. Please log in again.');
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const { accessToken, role } = response.data;
        
        setToken(accessToken);
        setTokenState(accessToken);

        const formattedRole = role && !role.startsWith('ROLE_') ? `ROLE_${role}` : role;

        const loggedInUser = {
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          role: formattedRole
        };

        setStoredUser(loggedInUser);
        setUserState(loggedInUser);
        toast.success(response.message || 'Login successful!');
        return { success: true, role: formattedRole };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.warn('Real API login failed, checking sandbox login fallback:', error);
      
      // Sandbox fallback credentials
      if ((email === 'admin@internship.com' && password === 'Password123!') ||
          (email === 'intern@internship.com' && password === 'Password123!')) {
        
        const isAdmin = email.includes('admin');
        const role = isAdmin ? 'ROLE_ADMIN' : 'ROLE_INTERN';
        const fullName = isAdmin ? 'Admin Manager' : 'System Intern';
        const accessToken = 'mock-jwt-token-string';
        
        setToken(accessToken);
        setTokenState(accessToken);

        const loggedInUser = {
          userId: isAdmin ? 'admin-id' : 'intern-id',
          fullName: fullName,
          email: email,
          role: role
        };

        setStoredUser(loggedInUser);
        setUserState(loggedInUser);
        
        toast.success(`Success! Logged in as ${fullName} (Sandbox Fallback)`);
        return { success: true, role };
      }
      
      const errorMsg = error.response?.data?.message || error.message || 'Invalid email or password';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const normalizedUserRole = user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
    const normalizedCheckedRoles = rolesArray.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r}`);
    return normalizedCheckedRoles.includes(normalizedUserRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
