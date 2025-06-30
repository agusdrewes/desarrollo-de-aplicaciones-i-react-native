import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRoutesService } from '../services/routesService';
import openGoogleMaps from '../utils/openGoogleMaps';

const AssignedRouteDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [assignedRoute, setAssignedRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAssignedRouteById, cancelAssignedRoute } = useRoutesService();

  const fetchAssignedRouteDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAssignedRouteById(id);
      setAssignedRoute(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      setError('Error al cargar los detalles');
      Alert.alert('Error', 'No se pudieron cargar los detalles de la entrega');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
  try {
    await cancelAssignedRoute(id);
    navigation.goBack(); 
  } catch (error) {
    Alert.alert('Error', 'No se pudo cancelar la entrega.');
  }
};

  useEffect(() => {
    fetchAssignedRouteDetails();
  }, []);

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getTimeDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;
    if (diffInDays === 1 && remainingHours === 1) {
      return `${diffInDays} día y ${remainingHours} hora`;
    } else if (diffInDays === 1) {
      return `${diffInDays} día y ${remainingHours} horas`;
    } else if (remainingHours === 1) {
      return `${diffInDays} días y ${remainingHours} hora`;
    } else {
      return `${diffInDays} días y ${remainingHours} horas`;
    }
  };

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'on_route':
        return '#2196F3';
    }
  };

  const getStatusText = status => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Entregado';
      case 'on_route':
        return 'En camino';
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
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#dee2e6' }}
            onPress={fetchAssignedRouteDetails}
          >
            <Text style={styles.buttonText}>🔁 Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>ID de Entrega:</Text>
          <Text style={styles.value}>#{assignedRoute.id.slice(0, 8)}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, { color: getStatusColor(assignedRoute.status) }]}>
            {getStatusText(assignedRoute.status)}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{assignedRoute.clientName}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Fecha de Asignación:</Text>
          <Text style={styles.value}>{formatDate(assignedRoute.delivery.assignedAt)}</Text>
        </View>

        {assignedRoute.status.toLowerCase() === 'completed' && (
          <>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Fecha de Entrega:</Text>
              <Text style={styles.value}>{formatDate(assignedRoute.delivery.deliveredAt)}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Tiempo de Entrega:</Text>
              <Text style={styles.value}>
                {getTimeDifference(
                  assignedRoute.delivery.assignedAt,
                  assignedRoute.delivery.deliveredAt
                )}
              </Text>
            </View>
          </>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>{assignedRoute.destination.address}</Text>
        </View>

        {assignedRoute?.status?.toLowerCase?.() !== 'completed' && (
          <View style={styles.buttonColumn}>
            <Pressable 
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.buttonPressed,
              ]}
              android_ripple={{ color: '#c3fae8' }}
              onPress={() => navigation.navigate('ConfirmDelivery', { 
                deliveryId: assignedRoute.id, 
                deliveryDetails: assignedRoute 
              })}
            >
              <Text style={styles.buttonText}>✅ Confirmar Entrega</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              android_ripple={{ color: '#ffe3e3' }}
              onPress={() => handleCancel(assignedRoute.id)}
            >
              <Text style={styles.buttonText}>❌ Cancelar Entrega</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.buttonColumnNav}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#dee2e6' }} 
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ 
                  name: 'MainTabs',
                  params: {
                    screen: 'AssignedRoutes',
                    params: {
                      screen: 'AssignedRoutesList'
                    }
                  }
                }],
              });
            }}
          >
            <Text style={styles.buttonText}>⬅️ Volver</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.mapButton,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#c3fae8' }}
            onPress={() => openGoogleMaps(assignedRoute.destination.coordinates)}
          >
            <Text style={styles.buttonText}>📍 Ver en Mapa</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonColumn: {
    marginTop: 20,
  },
  buttonColumnNav: {
    marginTop: 0,
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
  backButton: {
    backgroundColor: '#adb5bd',
  },
  mapButton: {
    backgroundColor: '#339af0',
  },
  confirmButton: {
    backgroundColor: '#51cf66',
  },
  cancelButton: {
    backgroundColor: '#ff5757',
  },
  retryButton: {
    backgroundColor: '#339af0',
    marginTop: 10,
    borderRadius: 25,
    paddingHorizontal: 25,
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

export default AssignedRouteDetails;
