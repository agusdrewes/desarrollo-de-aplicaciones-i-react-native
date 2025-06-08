import { useAxios } from '../hooks/useAxios';

export const useRouteService = () => {
  const { axiosInstance } = useAxios();

  const getRoutes = async () => {
    try {
      return await axiosInstance.get('/routes');
    } catch (error) {
      console.error('Error al obtener las rutas:', error.response?.data || error.message);
      throw error;
    }
  };

  return { getRoutes };
};
