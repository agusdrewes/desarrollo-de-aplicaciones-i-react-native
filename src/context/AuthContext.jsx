import { createContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken } from '../utils/tokenStorage';
import axios from 'axios';

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

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://192.168.100.11:3000/auth/signin', { email, password });
      const token = response.data.accessToken;
      await saveToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (email, fullName, password, passwordConfirmation) => {
    try {
      await axios.post('http://192.168.100.11:3000/auth/signup', { email, fullName, password, passwordConfirmation });
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
