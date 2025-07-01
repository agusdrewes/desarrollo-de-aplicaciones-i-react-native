import { StyleSheet, View } from 'react-native';
import { useAuthService } from '../services/authService';
import OtpForm from '../components/otp/OtpForm';
import { useOtpVerification } from '../hooks/useOtpVerification';

export default function ConfirmPassword({ navigation }) {
  const { otp, setOtp, loading, handleVerify } = useOtpVerification();
  const { confirmPassword, getErrorMessage } = useAuthService();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleVerifyPassword = () => {
    handleVerify({
      verificationFunction: confirmPassword,
      successMessage: 'Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio.',
      errorMessage: 'Ocurrió un error al confirmar tu contraseña. Por favor, verifica el código e inténtalo de nuevo.',
      onSuccess: navigateToLogin,
      onCancel: navigateToLogin,
    });
  };

  return (
    <View style={styles.container}>
      <OtpForm
        titleText="Ingresá el código que te enviamos a tu email para confirmar el cambio de clave"
        acceptButtonText="Verificar"
        cancelButtonText="Cancelar"
        onCancel={navigateToLogin}
        onAccept={handleVerifyPassword}
        onChange={setOtp}
        value={otp}
        loading={loading}
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
