import { useContext } from 'react';
import { useAxios } from '../hooks/useAxios';
import { AuthContext } from '../context/AuthContext';

export const useAuthService = () => {
  const { axiosInstance, getErrorMessage } = useAxios();
  const { login: authLogin } = useContext(AuthContext);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/signin', { email, password });
      const token = response.data.accessToken;
      await authLogin(token);
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (email, fullName, password, passwordConfirmation) => {
    try {
      await axiosInstance.post('/auth/signup', { email, fullName, password, passwordConfirmation });
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);
      throw error;
    }
  };

  const resetPassword = async (email, password, passwordConfirmation) => {
    try {
      await axiosInstance.post('/auth/password-reset', {
        email,
        password,
        passwordConfirmation,
      });
    } catch (error) {
      console.error('Error al recuperar password:', error.response?.data || error.message);
      throw error;
    }
  };

  /**
   *
   * @param {string} otp
   * @returns
   */
  const confirmSignup = async otp => {
    try {
      const response = await axiosInstance.post('/auth/signup/confirm', {
        otp,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming signup:', error);
      throw error;
    }
  };

  /**
   *
   * @param {string} otp
   * @returns
   */
  const confirmPassword = async otp => {
    try {
      const response = await axiosInstance.post('/auth/password-reset/confirm', {
        otp,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  };

  return {
    login,
    register,
    resetPassword,
    confirmSignup,
    confirmPassword,
    getErrorMessage,
  };
};
