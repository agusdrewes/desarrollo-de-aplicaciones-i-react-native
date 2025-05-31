import { useState } from 'react';
import { Text, Button } from 'react-native-paper';
import { Alert, StyleSheet, View } from 'react-native';
import OtpInput from '../components/OtpInput';
import { useAuthService } from '../services/authService';

export default function ConfirmSignup({ navigation }) {
  const [otp, setOtp] = useState('');
  const { confirmSignup } = useAuthService();

  const navigateToHome = () => {
    navigation.navigate('Home');
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
            onPress: navigateToHome,
          },
        ]
      );
    } catch (error) {
      console.error('Error confirming signup:', error);
      Alert.alert(
        'Confirmación incorrecta',
        'Ocurrió un error al confirmar tu cuenta. Por favor, verifica el código e inténtalo de nuevo.',
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
      <Text style={styles.title}>Ingresa el código</Text>
      <OtpInput value={otp} onChange={setOtp} />
      <Button
        title="Verificar"
        mode="contained"
        onPress={handleVerify}
        style={styles.button}
        disabled={otp.length !== 6}
      >
        Verificar
      </Button>
      <Button title="Cancelar" mode="contained" onPress={navigateToHome} style={styles.button}>
        Cancelar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
