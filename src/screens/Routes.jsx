import { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouteService } from '../services/routeService';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { getRoutes } = useRouteService();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getRoutes();
        setRoutes(res.data);
      } catch (err) {
        setErrorMessage('Error al obtener las rutas');
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handlePressItem = item => {
    navigation.navigate('RouteDetails', {
      packageId: item.packageId,
      warehouse: item.warehouse,
      destinationNeighborhood: item.destinationNeighborhood,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePressItem(item)}>
      <MaterialIcons name="local-shipping" size={24} color="#555" style={styles.icon} />
      <View>
        <Text style={styles.title}>{item.warehouse}</Text>
        <Text style={styles.subtitle}>{item.destinationNeighborhood}</Text>
        <Text style={styles.packageId}>ID: {item.packageId}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : (
        <FlatList data={routes} keyExtractor={item => item.packageId} renderItem={renderItem} />
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
  packageId: {
    fontSize: 12,
    color: '#999',
  },
});
