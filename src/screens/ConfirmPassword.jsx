import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useAuthService } from '../services/authService';
import OtpForm from '../components/otp/OtpForm';

export default function ConfirmPassword({ navigation }) {
  const [otp, setOtp] = useState('');
  const { confirmPassword, getErrorMessage } = useAuthService();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const handleVerify = async () => {
    try {
      // Call the confirmPassword function with the OTP
      await confirmPassword(otp);
      console.log('Password reset confirmed');
      Alert.alert(
        'Confirmación exitosa',
        'Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio.',
        [
          {
            text: 'OK',
            onPress: navigateToHome,
          },
        ]
      );
    } catch (error) {
      console.error('Error confirming password reset:', error);
      Alert.alert(
        'Confirmación incorrecta',
        getErrorMessage(error) ||
          'Ocurrió un error al confirmar tu contraseña. Por favor, verifica el código e inténtalo de nuevo.',
        [
          {
            text: 'OK',
          },
          {
            text: 'Cancelar',
            onPress: navigateToHome,
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <OtpForm
        titleText="Ingresá el código que te enviamos a tu email para confirmar el cambio de clave"
        acceptButtonText="Verificar"
        cancelButtonText="Cancelar"
        onCancel={navigateToHome}
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
