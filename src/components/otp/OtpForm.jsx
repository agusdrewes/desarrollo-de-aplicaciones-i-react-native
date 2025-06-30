
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import OtpInput from './OtpInput';


export default function OtpForm({
  titleText = 'Ingresá el código que te enviamos a tu email',
  acceptButtonText = 'Aceptar',
  cancelButtonText = 'Cancelar',
  onCancel,
  onAccept,
  onChange,
  value = '',
  loading = false,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>
      <OtpInput value={value} onChange={onChange} />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onAccept}
          style={styles.button}
          disabled={value.length !== 6 || loading}
          loading={loading}
        >
          {acceptButtonText}
        </Button>
        <Button 
          mode="contained" 
          onPress={onCancel} 
          style={styles.button}
          disabled={loading}
        >
          {cancelButtonText}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
    maxWidth: 400,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    borderRadius: 100,
    width: '100%',
  },
});