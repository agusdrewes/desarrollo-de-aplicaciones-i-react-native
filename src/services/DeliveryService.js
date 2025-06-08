import { useAxios } from '../hooks/useAxios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useDeliveryService = () => {
  const { axiosInstance } = useAxios();
  const { token } = useContext(AuthContext);

  const getDeliveries = async () => {
    try {
      const response = await axiosInstance.get('/entregas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las entregas:', error.response?.data || error.message);
      throw error;
    }
  };

  const getDeliveryById = async id => {
    try {
      const response = await axiosInstance.get(`/entregas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la entrega:', error.response?.data || error.message);
      throw error;
    }
  };

  return { getDeliveries, getDeliveryById };
};
