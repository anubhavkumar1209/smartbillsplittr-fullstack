import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.setAuthToken(token);
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token } = response.data;
    
    localStorage.setItem('token', token);
    authService.setAuthToken(token);
    setUser({ token });
    
    return response;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    authService.setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
