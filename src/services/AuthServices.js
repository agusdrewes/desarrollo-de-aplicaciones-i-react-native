import { useAxios } from "../hooks/useAxios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthService = () => {
    const axiosInstance = useAxios();
    const { login : authLogin } = useContext(AuthContext);

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

    return { login, register };
}