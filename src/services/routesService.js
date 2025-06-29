import { useAxios } from '../hooks/useAxios';

export const useRoutesService = () => {
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

  const getAssignedRoutes = async () => {
    try {
      return await axiosInstance.get('/routes/assigned');
    } catch (error) {
      console.error('Error al obtener las rutas asignadas:', error.response?.data || error.message);
      throw error;
    }
  };

  const getAssignedRouteById = async id => {
    try {
      return await axiosInstance.get(`/routes/assigned/${id}`);
    } catch (error) {
      console.error(
        'Error al obtener la ruta asignada por id:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getAssignedRouteCancel = async id => {
    try {
      return await axiosInstance.post(`/routes/${id}/cancel`);
    } catch (error) {
      console.error(
        'Error al obtener la ruta asignada por id:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getAssignedRouteDelivered = async (id,confirmationCode) => {
    try {
      return await axiosInstance.post(`/routes/${id}/deliver/${confirmationCode}`);
    } catch (error) {
      console.error(
        'Error al obtener la ruta asignada por id:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return { getPendingRoutes, getAssignedRoutes, getAssignedRouteById, getAssignedRouteCancel,getAssignedRouteDelivered };
};
