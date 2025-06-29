import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/RegisterStyle';
import { useAuthService } from '../services/authService';
import isEmailValid from '../utils/isEmailValid';

export default function Register() {
  const navigation = useNavigation();
  const { register } = useAuthService();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const isFormIncomplete =
    !nombre || !apellido || !email || !password || !confirmPassword;

  const validateFields = () => {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = 'El nombre no puede estar vacío';
    if (!apellido.trim()) newErrors.apellido = 'El apellido no puede estar vacío';
    if (!email.trim()) {
      newErrors.email = 'El email no puede estar vacío';
    } else if (!isEmailValid(email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!password) {
      newErrors.password = 'La contraseña no puede estar vacía';
    } else if (password.length < 6) {
      newErrors.password = 'Debe tener al menos 6 caracteres';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateFields()) {
      try {
        await register(email, `${nombre} ${apellido}`, password, confirmPassword);
        Alert.alert('Éxito', 'Revisa tu email para confirmar el registro');
        navigation.navigate('ConfirmSignup');
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'No se pudo registrar');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Register</Text>

      <TextInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        mode="flat"
        error={!!errors.nombre}
        style={styles.input}
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <TextInput
        label="Apellido"
        value={apellido}
        onChangeText={setApellido}
        mode="flat"
        error={!!errors.apellido}
        style={styles.input}
      />
      {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="flat"
        error={!!errors.email}
        style={styles.input}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="flat"
        error={!!errors.password}
        style={styles.input}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="flat"
        error={!!errors.confirmPassword}
        style={styles.input}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
        >
          Cancelar
        </Button>

        <Button
          mode="contained"
          onPress={handleRegister}
          disabled={isFormIncomplete}
          style={[styles.button, isFormIncomplete && styles.disabledButton]}
        >
          Registrarse
        </Button>
      </View>
    </View>
  );
}
