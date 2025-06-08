import { useAxios } from '../hooks/useAxios';

export const useAuthService = () => {
  const { axiosInstance, getErrorMessage } = useAxios();

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
    confirmSignup,
    confirmPassword,
    getErrorMessage,
  };
};
