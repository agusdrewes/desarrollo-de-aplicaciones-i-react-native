import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

export default function Logout() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Cerrar sesión</Text>
          <Text style={styles.value}>¿Estás seguro que querés cerrar tu sesión?</Text>
        </View>

        <View style={styles.buttonColumn}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#ffe3e3' }}
            onPress={logout}
          >
            <Text style={styles.buttonText}>🚪 Cerrar sesión</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#dee2e6' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>⬅️ Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  infoSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  buttonColumn: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#ff5757',
  },
  backButton: {
    backgroundColor: '#adb5bd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
});
