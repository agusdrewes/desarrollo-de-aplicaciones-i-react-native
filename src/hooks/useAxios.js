import axios from 'axios';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils/tokenStorage';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

export const getErrorMessage = error => {
  // Try different common error message locations
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.details ||
    error.message ||
    null
  );
};

export const useAxios = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const getBaseUrl = () => {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:3000';
    } else {
      return 'http://localhost:3000';
    }
  };

  const axiosInstance = useRef(
    axios.create({
      baseURL: getBaseUrl(),
      timeout: 10000, // Timeout de 10 segundos
    })
  );

  useEffect(() => {
    const instance = axiosInstance.current;

    instance.interceptors.request.use(async config => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      res => res,
      async err => {
        if (err.response?.status === 401) {
          await logout(); // Actualiza estado global
          navigation.reset({
            // Borra historial y navega al login
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return { axiosInstance: axiosInstance.current, getErrorMessage };
};
