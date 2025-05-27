import { useAxiosPublic } from './useAxiosPublic';

/**
 *
 * @param {string} otp
 */
const handleSignUpConfirm = async otp => {
  const axios = useAxiosPublic();
  try {
    const response = await axios.post('/signup/confirm', {
      otp,
    });
    if (response.status === 200) {
      // handle successful confirmation, e.g., redirect to login or show success message
      return;
    } else {
      // handle unsuccessful confirmation, e.g., show error message
      throw new Error('Confirmation failed');
    }
  } catch (error) {
    console.error('Error confirming signup:', error);
    throw new Error('Confirmation failed');
  }
};
