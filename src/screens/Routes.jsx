import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Routes() {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla Rutas (Routes)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
