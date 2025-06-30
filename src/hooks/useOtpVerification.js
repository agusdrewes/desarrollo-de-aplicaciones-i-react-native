import { useState } from 'react';
import { Alert } from 'react-native';

export const useOtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async ({
    verificationFunction,
    successMessage = 'Verificación exitosa',
    errorMessage = 'Error en la verificación',
    onSuccess,
    onError,
    onCancel,
  }) => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Por favor ingresa un código de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      await verificationFunction(otp);
      console.log('OTP verification successful');
      
      Alert.alert(
        'Éxito',
        successMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              setOtp('');
              if (onSuccess) onSuccess();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error during OTP verification:', error);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'OK',
          },
          {
            text: 'Cancelar',
            onPress: () => {
              setOtp('');
              if (onCancel) onCancel();
            },
            style: 'cancel',
          },
        ]
      );
      
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetOtp = () => {
    setOtp('');
  };

  return {
    otp,
    setOtp,
    loading,
    handleVerify,
    resetOtp,
  };
}; 
