import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useDeliveryService } from '../services/DeliveryService';

const DetailedDeliveryView = ({ route, navigation }) => {
  const { delivery: initialDelivery } = route.params;
  const [delivery, setDelivery] = useState(initialDelivery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getDeliveryById } = useDeliveryService();

  useEffect(() => {
    fetchDeliveryDetails();
  }, []);

  const fetchDeliveryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedDelivery = await getDeliveryById(initialDelivery.id);
      setDelivery(updatedDelivery);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      setError('Error al cargar los detalles');
      Alert.alert('Error', 'No se pudieron cargar los detalles de la entrega');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#4CAF50'; 
      case 'cancelado':
        return '#F44336'; 
      case 'demorado':
        return '#FF9800'; 
      case 'en camino':
        return '#2196F3'; 
      case 'pendiente':
      default:
        return '#9E9E9E'; 
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchDeliveryDetails}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>ID de Entrega:</Text>
          <Text style={styles.value}>#{delivery.id.slice(0, 8)}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[
            styles.value,
            { color: getStatusColor(delivery.estado) }
          ]}>
            {delivery.estado}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{delivery.cliente}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Fecha de Entrega:</Text>
          <Text style={styles.value}>{formatDate(delivery.fechaEntrega)}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>{delivery.direccion}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Repartidor:</Text>
          <Text style={styles.value}>{delivery.repartidorEmail}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  infoSection: {
    marginBottom: 15,
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0000ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailedDeliveryView; 