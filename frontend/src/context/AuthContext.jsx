import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sms_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('sms_token'));

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('sms_token', data.token);
    localStorage.setItem('sms_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, logout, isAuthenticated: Boolean(token) }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
