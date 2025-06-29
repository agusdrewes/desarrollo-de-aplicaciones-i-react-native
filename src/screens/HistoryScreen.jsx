import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.text}>
        Pantalla Historial (History)
      </Text>
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
    fontWeight: 'bold',
  },
});
