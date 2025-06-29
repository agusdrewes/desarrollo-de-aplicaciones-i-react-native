import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PendingRouteDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, warehouse, destinationNeighborhood } = route.params;

  const handleScanQR = () => {
    navigation.navigate('QRScanner');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Detalle de Ruta</Text>

      <Text style={styles.label}>ID del Paquete:</Text>
      <Text style={styles.value}>{id}</Text>

      <Text style={styles.label}>Depósito:</Text>
      <Text style={styles.value}>{warehouse.name}</Text>
      <Text style={styles.label}>Sección:</Text>
      <Text style={styles.value}>{warehouse.section}</Text>
      <Text style={styles.label}>Estante:</Text>
      <Text style={styles.value}>{warehouse.shelf}</Text>

      <Text style={styles.label}>Barrio de Destino:</Text>
      <Text style={styles.value}>{destinationNeighborhood}</Text>

      <Button
        mode="contained"
        onPress={handleScanQR}
        style={styles.button}
      >
        Escanear QR
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Volver
      </Button>
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
    marginBottom: 24,
    textAlign: 'center',
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
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
});
