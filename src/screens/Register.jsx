import React, { useState } from 'react';
import { useAuthService } from '../services/authService';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import styles from '../styles/RegisterStyle';
import { useNavigation } from '@react-navigation/native';
import isEmailValid from '../utils/isEmailValid'

export default function Register() {
  const navigation = useNavigation();
  const { register } = useAuthService();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormIncomplete =
    nombre === '' || apellido === '' || email === '' || password === '' || confirmPassword === '';

  const [errors, setErrors] = useState({});

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
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>

        <Pressable
          style={[styles.button, isFormIncomplete && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isFormIncomplete}
        >
          <Text style={[styles.buttonText, isFormIncomplete && styles.disabledText]}>
            Registrarse
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
