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
    <TouchableOpacity
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

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchAssignedRoutes}>
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

export default AssignedRoutes;
