import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import isEmailValid from '../utils/isEmailValid'
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
      navigation.navigate('ConfirmPassword')
    } catch (error) {
      let msg = err?.response?.data?.message;
      if (Array.isArray(msg)) {
        msg = msg.join('\n')
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
          <Text style={styles.title}>Recuperar contraseña</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Nueva clave"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
              if (confirmation) validateConfirmation(confirmation);
            }}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva clave"
            secureTextEntry
            value={confirmation}
            onChangeText={(text) => {
              setConfirmation(text);
              validateConfirmation(text);
            }}
          />
          {confirmationError ? (
            <Text style={styles.errorText}>{confirmationError}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.loginButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={!isFormValid}
          >
            <Text style={styles.forgotPasswordButtonText}>Recuperar clave</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        <Snackbar
          visible={visible}
          style={snackbarError ? { backgroundColor: '#c0392b' } : { backgroundColor: '#27ae60' }}
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 12,
  },
});