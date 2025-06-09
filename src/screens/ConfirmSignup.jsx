import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuthService } from '../services/authService';
import OtpForm from '../components/otp/OtpForm';

export default function ConfirmSignup({ navigation }) {
  const [otp, setOtp] = useState('');
  const { confirmSignup, getErrorMessage } = useAuthService();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleVerify = async () => {
    try {
      // Call the confirmSignup function with the OTP
      await confirmSignup(otp);
      console.log('Signup confirmed');
      Alert.alert(
        'Confirmación exitosa',
        'Tu cuenta ha sido confirmada correctamente. Serás redirigido al inicio.',
        [
          {
            text: 'OK',
            onPress: navigateToLogin,
          },
        ]
      );
    } catch (error) {
      console.error('Error confirming signup:', error);
      Alert.alert(
        'Confirmación incorrecta',
        getErrorMessage(error) ||
          'Ocurrió un error al confirmar tu cuenta. Por favor, verifica el código e inténtalo de nuevo.',
        [
          {
            text: 'OK',
          },
          {
            text: 'Cancelar',
            onPress: navigateToLogin,
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <OtpForm
        titleText="Ingresá el código que te enviamos a tu email para confirmar el registro"
        acceptButtonText="Verificar"
        cancelButtonText="Cancelar"
        onCancel={navigateToLogin}
        onAccept={handleVerify}
        onChange={setOtp}
        value={otp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
