import { useAxios } from '../hooks/useAxios';

export const useRouteService = () => {
  const { axiosInstance } = useAxios();

  const getPendingRoutes = async () => {
    try {
      return await axiosInstance.get('/routes/pending');
    } catch (error) {
      console.error(
        'Error al obtener las rutas pendientes:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return { getPendingRoutes };
};
