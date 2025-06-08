import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Routes from '../screens/Routes';
import HistoryScreen from '../screens/HistoryScreen';
import Logout from '../screens/Logout';

import Home from '../screens/Home';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Routes"
      component={Routes}
      options={{
        headerShown: false,
        tabBarLabel: 'Rutas',
      }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarLabel: 'Historial',
      }}
    />
    <Tab.Screen
      name="Logout"
      component={Logout}
      options={{
        tabBarLabel: 'Salir',
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
