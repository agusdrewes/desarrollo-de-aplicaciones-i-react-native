import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useDeliveryService } from '../services/deliveryService';

const DeliveryHistory = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { getDeliveries } = useDeliveryService();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Intentando obtener entregas...');
      const data = await getDeliveries();
      console.log('Entregas recibidas:', data);
      setDeliveries(data);
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError('Error al cargar las entregas');
      Alert.alert('Error', 'No se pudieron cargar las entregas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDeliveries().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getStatusColor = status => {
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

  const renderDeliveryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deliveryItem}
      onPress={() => navigation.navigate('DeliveryDetail', { delivery: item })}
    >
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryId}>#{item.id.slice(0, 8)}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.estado) }]}>{item.estado}</Text>
      </View>
      <Text style={styles.text}>Cliente: {item.cliente}</Text>
      <Text style={styles.text}>Fecha: {formatDate(item.fechaEntrega)}</Text>
      <Text style={styles.text}>Dirección: {item.direccion}</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
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
          <TouchableOpacity style={styles.button} onPress={fetchDeliveries}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={deliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay entregas disponibles</Text>}
      />
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
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  deliveryId: {
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 2,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0000ff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default DeliveryHistory;
