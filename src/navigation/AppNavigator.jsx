import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Routes from '../screens/Routes';
import RouteDetails from '../screens/RouteDetails';
import HistoryScreen from '../screens/HistoryScreen';
import Logout from '../screens/Logout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Routes"
      component={Routes}
      options={{
        headerShown: false,
        tabBarLabel: 'Rutas',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="local-shipping" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarLabel: 'Historial',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="history" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Logout"
      component={Logout}
      options={{
        tabBarLabel: 'Salir',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="logout" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
    <Stack.Screen name="RouteDetails" component={RouteDetails} options={{ title: 'Detalle de Ruta' }} />
  </Stack.Navigator>
);

export default AppNavigator;
