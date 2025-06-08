import { useAxios } from "../hooks/useAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useEntregaService = () => {
    const axiosInstance = useAxios();
    const { token } = useContext(AuthContext);

    const getEntregasDelRepartidor = async () => {
        try {
            const response = await axiosInstance.get('/entregas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener las entregas:', error.response?.data || error.message);
            throw error;
        }
    };

    const getEntregaById = async (id) => {
        try {
            const response = await axiosInstance.get(`/entregas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener la entrega:', error.response?.data || error.message);
            throw error;
        }
    };

    return { getEntregasDelRepartidor, getEntregaById };
}; 