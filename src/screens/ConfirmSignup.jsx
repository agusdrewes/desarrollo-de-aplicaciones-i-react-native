import { StyleSheet, View } from 'react-native';
import { useAuthService } from '../services/authService';
import { useOtpVerification } from '../hooks/useOtpVerification';
import OtpForm from '../components/otp/OtpForm';

export default function ConfirmSignup({ navigation }) {
  const { confirmSignup, getErrorMessage } = useAuthService();
  const { otp, setOtp, loading, handleVerify } = useOtpVerification();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleVerifySignup = () => {
    handleVerify({
      verificationFunction: confirmSignup(otp),
      successMessage: 'Tu cuenta ha sido confirmada correctamente. Serás redirigido al inicio.',
      errorMessage: 'Ocurrió un error al confirmar tu cuenta. Por favor, verifica el código e inténtalo de nuevo.',
      onSuccess: navigateToLogin,
      onCancel: navigateToLogin,
    });
  };

  return (
    <View style={styles.container}>
      <OtpForm
        titleText="Ingresá el código que te enviamos a tu email para confirmar el registro"
        acceptButtonText="Verificar"
        cancelButtonText="Cancelar"
        onCancel={navigateToLogin}
        onAccept={handleVerifySignup}
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
