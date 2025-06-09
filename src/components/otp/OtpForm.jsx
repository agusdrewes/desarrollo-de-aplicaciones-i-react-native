import { Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import OtpInput from './OtpInput';

/**
 * OtpForm component for OTP verification during password reset process.
 * Displays an OTP input form and handles verification with success/error alerts.
 *
 * @param {Object} props - Component props
 * @param {string} props.titleText - The title text to display
 * @param {string} props.acceptButtonText - Text for the accept button
 * @param {string} props.cancelButtonText - Text for the cancel button
 * @param {() => void} props.onCancel - Callback function when cancel is pressed
 * @param {() => void} props.onAccept - Callback function when accept is pressed
 * @returns {JSX.Element} The OtpForm component
 */
export default function OtpForm({
  titleText = 'Ingresá el código que te enviamos a tu email',
  acceptButtonText = 'Aceptar',
  cancelButtonText = 'Cancelar',
  onCancel,
  onAccept,
  onChange,
  value = '',
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
          disabled={value.length !== 6}
        >
          {acceptButtonText}
        </Button>
        <Button mode="contained" onPress={onCancel} style={styles.button}>
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
