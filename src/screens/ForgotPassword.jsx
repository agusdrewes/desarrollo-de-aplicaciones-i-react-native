import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';
import isEmailValid from '../utils/isEmailValid';
import { useAuthService } from '../services/authService';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { resetPassword } = useAuthService();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const validateEmail = (value) => {
    if (!isEmailValid(value)) {
      setEmailError('Formato de email inválido');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      setPasswordError('La clave debe tener al menos 6 caracteres');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmation = (value) => {
    if (value !== password) {
      setConfirmationError('Las claves no coinciden');
    } else {
      setConfirmationError('');
    }
  };

  const isFormValid =
    email &&
    password &&
    confirmation &&
    !emailError &&
    !passwordError &&
    !confirmationError;

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    try {
      await resetPassword(email, password, confirmation);
      setSnackbarMsg(
        'Si el email existe en nuestro sistema te enviaremos un email para recuperar tu clave'
      );
      setSnackbarError(false);
      setVisible(true);
      navigation.navigate('ConfirmPassword');
    } catch (err) {
      let msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        msg = msg.join('\n');
      } else if (typeof msg !== 'string') {
        msg = 'Error al recuperar la clave';
      }
      setSnackbarMsg(msg);
      setSnackbarError(true);
      setVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            Recuperar contraseña
          </Text>

          <TextInput
            label="Email"
            mode="flat"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            style={styles.input}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            label="Nueva clave"
            mode="flat"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
              if (confirmation) validateConfirmation(confirmation);
            }}
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TextInput
            label="Confirmar nueva clave"
            mode="flat"
            secureTextEntry
            value={confirmation}
            onChangeText={(text) => {
              setConfirmation(text);
              validateConfirmation(text);
            }}
            error={!!confirmationError}
            style={styles.input}
          />
          {confirmationError ? (
            <Text style={styles.errorText}>{confirmationError}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            disabled={!isFormValid}
            style={[styles.button, !isFormValid && styles.disabledButton]}
          >
            Recuperar clave
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            Cancelar
          </Button>
        </View>

        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={4000}
          style={{
            backgroundColor: snackbarError ? '#c0392b' : '#27ae60',
          }}
        >
          {snackbarMsg}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FDF5F5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    borderRadius: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
});