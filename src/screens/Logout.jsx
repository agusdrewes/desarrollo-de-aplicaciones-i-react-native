import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function Logout() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¿Seguro que querés cerrar sesión?</Text>
      <Button mode="contained" onPress={logout} style={styles.button}>
        Cerrar sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
  },
});
