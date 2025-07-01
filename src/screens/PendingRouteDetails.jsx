import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PendingRouteDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, warehouse, destinationNeighborhood } = route.params;
  
  const handleScanQR = () => {
    navigation.navigate('QRScanner', {id: id});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>ID del Paquete:</Text>
          <Text style={styles.value}>#{id.slice(0, 8)}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Depósito:</Text>
          <Text style={styles.value}>{warehouse.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Sección:</Text>
          <Text style={styles.value}>{warehouse.section}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Estante:</Text>
          <Text style={styles.value}>{warehouse.shelf}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Barrio de Destino:</Text>
          <Text style={styles.value}>{destinationNeighborhood}</Text>
        </View>

        <View style={styles.buttonColumn}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.scanButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleScanQR}
          >
            <Text style={styles.buttonText}>📷 Escanear QR</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.backButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>⬅️ Volver</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  infoSection: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
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
  scanButton: {
    backgroundColor: '#2196F3',
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
