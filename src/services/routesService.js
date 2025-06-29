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

   const getUnassignedRouteById = async id => {
    try {
      return await axiosInstance.get(`/routes/unassigned/${id}`);
    } catch (error) {
      console.error(
        'Error al obtener la ruta por id:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const cancelAssignedRoute = async id => {
    try {
      return await axiosInstance.post(`/routes/${id}/cancel`);
    } catch (error) {
      console.error(
        'Error al cancelar la ruta asignada:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const assignRoute = async (id,confirmationCode) => {
    try {
      return await axiosInstance.post(`/routes/${id}/assign/${confirmationCode}`);
    } catch (error) {
      console.error(
        'Error al asignar la ruta:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const deliverAsignedRoute = async (id,confirmationCode) => {
    try {
      return await axiosInstance.post(`/routes/${id}/deliver/${confirmationCode}`);
    } catch (error) {
      console.error(
        'Error al asignar la ruta:',
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return { getPendingRoutes, getAssignedRoutes, getAssignedRouteById, assignRoute,cancelAssignedRoute,getUnassignedRouteById,deliverAsignedRoute };
};
