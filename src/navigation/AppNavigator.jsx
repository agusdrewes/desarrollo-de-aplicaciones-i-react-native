import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Routes from '../screens/Routes';
import RouteDetails from '../screens/RouteDetails';
import DeliveryHistory from '../screens/DeliveryHistory';
import DetailedDeliveryView from '../screens/DetailedDeliveryView';
import Logout from '../screens/Logout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RoutesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RoutesList"
      component={Routes}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RouteDetails"
      component={RouteDetails}
      options={{ title: 'Detalle de Ruta' }}
    />
  </Stack.Navigator>
);

const DeliveriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DeliveriesList"
      component={DeliveryHistory}
      options={{ 
        headerShown: false
      }}
    />
    <Stack.Screen
      name="DeliveryDetail"
      component={DetailedDeliveryView}
      options={{ 
        title: 'Detalle de Entrega',
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  </Stack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        paddingBottom: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    }}
  >
    <Tab.Screen
      name="Routes"
      component={RoutesStack}
      options={{
        headerShown: false,
        tabBarLabel: 'Rutas',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="local-shipping" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Historial"
      component={DeliveriesStack}
      options={{
        headerShown: false,
        tabBarLabel: 'Historial',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Logout"
      component={Logout}
      options={{
        tabBarLabel: 'Salir',
        tabBarIcon: ({ color, size }) => <MaterialIcons name="logout" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={Tabs} />
  </Stack.Navigator>
);

export default AppNavigator;
