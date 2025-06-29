import { View, Text, StyleSheet, Button } from 'react-native';
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
      <Text style={styles.title}>Detalle de Ruta</Text>
      <Text style={styles.label}>ID del Paquete:</Text>
      <Text style={styles.value}>{id}</Text>

      <Text style={styles.label}>Depósito:</Text>
      <Text style={styles.value}>{warehouse.name}</Text>
      <Text style={styles.label}>Seccion:</Text>
      <Text style={styles.value}>{warehouse.section}</Text>
      <Text style={styles.label}>Estante:</Text>
      <Text style={styles.value}>{warehouse.shelf}</Text>

      <Text style={styles.label}>Barrio de Destino:</Text>
      <Text style={styles.value}>{destinationNeighborhood}</Text>

      <Button 
          title="Escanear QR" 
          onPress={handleScanQR}
          color="#2196F3"
        />
        <View style={styles.buttonSpacer} />

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
