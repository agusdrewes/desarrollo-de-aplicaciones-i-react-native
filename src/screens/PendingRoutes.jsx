import { useEffect, useState } from 'react';
import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoutesService } from '../services/routesService';

export default function PendingRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { getPendingRoutes } = useRoutesService();

  const fetchRoutes = async () => {
    try {
      setErrorMessage(''); // Clear any previous errors
      const res = await getPendingRoutes();
      setRoutes(res.data);
    } catch (err) {
      setErrorMessage('Error al obtener las rutas');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRoutes().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handlePressItem = item => {
    navigation.navigate('PendingRouteDetails', {
      id: item.id,
      warehouse: item.warehouse,
      destinationNeighborhood: item.destinationNeighborhood,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePressItem(item)}>
      <MaterialIcons name="local-shipping" size={24} color="#555" style={styles.icon} />
      <View>
        <Text style={styles.title}>{item.warehouse.name}</Text>
        <Text style={styles.subtitle}>{item.destinationNeighborhood}</Text>
        <Text style={styles.id}>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : (
        <FlatList 
          data={routes} 
          keyExtractor={item => item.id} 
          renderItem={renderItem}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
            />
          }
        />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{ label: 'Cerrar', onPress: () => setSnackbarVisible(false) }}
      >
        {errorMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 100,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  id: {
    fontSize: 12,
    color: '#999',
  },
});
