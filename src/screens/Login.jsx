import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyle';
import { useAuthService } from '../services/authService';
import isEmailValid from '../utils/isEmailValid';

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuthService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value) => {
    if (!isEmailValid(value)) {
      setEmailError('Formato de email inválido');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('La contraseña no puede estar vacía');
    } else if (value.length < 6) {
      setPasswordError('Debe tener al menos 6 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    if (!emailError && !passwordError && email && password) {
      try {
        await login(email, password);
      } catch (error) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'No se pudo iniciar sesión. Intente nuevamente.'
        );
      }
    } else {
      Alert.alert('Error', 'Por favor, completa los campos correctamente.');
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>
            Login
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="flat"
            error={!!emailError}
            style={styles.input}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            secureTextEntry
            mode="flat"
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={!isFormValid}
            style={[styles.loginButton, !isFormValid && styles.disabledButton]}
          >
            Iniciar Sesión
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('Register')}>
            Registrate
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')}>
            Olvidaste tu contraseña?
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
