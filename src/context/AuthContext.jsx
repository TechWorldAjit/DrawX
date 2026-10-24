import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('drawx_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('drawx_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem('drawx_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('drawx_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    }

    verifyAuth();

    function handleAutoLogout() {
      logout();
    }

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => window.removeEventListener('auth-logout', handleAutoLogout);
  }, []);

  const login = async (identifier, password) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem('drawx_token', res.token);
    localStorage.setItem('drawx_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const signup = async (username, email, password) => {
    const res = await api.signup({ username, email, password });
    localStorage.setItem('drawx_token', res.token);
    localStorage.setItem('drawx_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('drawx_token');
    localStorage.removeItem('drawx_user');
    setToken(null);
    setUser(null);
  };

  const updateSettings = async (settings) => {
    const res = await api.updateSettings(settings);
    setUser(res.user);
    localStorage.setItem('drawx_user', JSON.stringify(res.user));
    return res.user;
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        signup,
        logout,
        updateSettings,
        authModalOpen,
        authModalMode,
        openAuth,
        closeAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
