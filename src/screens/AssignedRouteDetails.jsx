import { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useRoutesService } from '../services/routesService';

const AssignedRouteDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [assignedRoute, setAssignedRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAssignedRouteById, getAssignedRouteCancel } = useRoutesService();

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
    await getAssignedRouteCancel(id);
    navigation.goBack(); // ⚠️ reemplazá con el nombre real de tu screen
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

  // Get the days and hours between two dates
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
          <ActivityIndicator animating={true} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Button mode="contained" onPress={fetchAssignedRouteDetails} style={styles.button}>
            Reintentar
          </Button>
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
              <Text style={styles.value}>
                {formatDate(assignedRoute.delivery.deliveredAt)}
              </Text>
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

        <View style={styles.buttonContainer}>
          {assignedRoute?.status?.toLowerCase?.() !== 'completed' && (
            <>
              <Button
                mode="contained"
                style={styles.button}
                onPress={() =>
                  navigation.navigate('ConfirmDelivery', {
                    deliveryId: assignedRoute.id,
                    deliveryDetails: assignedRoute,
                  })
                }
              >
                Confirmar Entrega
              </Button>

              <Button
                mode="outlined"
                style={styles.button}
                onPress={() => handleCancel(assignedRoute.id)}
              >
                Cancelar Entrega
              </Button>
            </>
          )}

          <Button mode="text" onPress={() => navigation.goBack()} style={styles.button}>
            Volver
          </Button>
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
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    borderRadius: 6,
  },
});

export default AssignedRouteDetails;