import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useRoutesService } from '../services/routesService';

const AssignedRoutes = ({ navigation }) => {
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { getAssignedRoutes } = useRoutesService();

  const fetchAssignedRoutes = async () => {
    try {
      const res = await getAssignedRoutes();
      setAssignedRoutes(res.data);
    } catch (err) {
      setLoading(true);
      console.error('Error fetching assigned routes:', err);
      setErrorMessage('Error al obtener las rutas asignadas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAssignedRoutes().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchAssignedRoutes();
  }, []);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[AssignedRoutes] Screen focused, refreshing data');
      fetchAssignedRoutes();
    }, [])
  );

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const getStatusColor = status => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'on_route':
        return '#2196F3';
      default:
        return '#666'; //  Default color for unknown status
    }
  };

  const getStatusText = status => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Entregado';
      case 'on_route':
        return 'En camino';
      default:
        return 'Estado desconocido'; // Default text for unknown status
    }
  };

  const renderAssignedRouteItem = ({ item }) => (
    <Pressable
      style={styles.assignedRoutesItem}
      onPress={() => navigation.navigate('AssignedRouteDetails', { id: item.id })}
    >
      <View style={styles.assignedRoutesHeader}>
        <Text style={styles.id}>#{item.id.slice(0, 8)}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <Text style={styles.text}>Cliente: {item.clientName}</Text>
      <Text style={styles.text}>Fecha: {formatDate(item.date)}</Text>
      <Text style={styles.text}>Dirección: {item.address}</Text>
    </Pressable>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
            <Button mode="contained" onPress={fetchAssignedRoutes} style={styles.button}>
              Reintentar
            </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={assignedRoutes}
        renderItem={renderAssignedRouteItem}
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
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignedRoutesItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  assignedRoutesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  id: {
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 2,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default AssignedRoutes;
