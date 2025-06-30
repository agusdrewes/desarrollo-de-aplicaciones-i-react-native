import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyle';
import { useAuthService } from '../services/authService';
import isEmailValid from '../utils/isEmailValid'

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
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={text => {
              setPassword(text);
              validatePassword(text);
            }}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Pressable
        style={[styles.loginButton, !isFormValid && styles.disabledButton]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Registrate</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
      </Pressable>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
