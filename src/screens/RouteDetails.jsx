import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RouteDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, warehouseName, destinationNeighborhood } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Ruta</Text>
      <Text style={styles.label}>ID del Paquete:</Text>
      <Text style={styles.value}>{id}</Text>

      <Text style={styles.label}>Depósito:</Text>
      <Text style={styles.value}>{warehouseName}</Text>

      <Text style={styles.label}>Barrio de Destino:</Text>
      <Text style={styles.value}>{destinationNeighborhood}</Text>

      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
});
