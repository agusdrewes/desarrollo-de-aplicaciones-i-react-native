import { createContext, useState, useEffect } from 'react';
import { getToken, removeToken, saveToken } from '../utils/tokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
    };
    init();
  }, []);

  const login = async (token) => {
    await saveToken(token);
    setIsAuthenticated(true);
  }

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
