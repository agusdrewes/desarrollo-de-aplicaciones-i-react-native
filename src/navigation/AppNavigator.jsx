import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PendingRoutes from '../screens/PendingRoutes';
import PendingRouteDetails from '../screens/PendingRouteDetails';
import AssignedRouteDetails from '../screens/AssignedRouteDetails';
import Logout from '../screens/Logout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import AssignedRoutes from '../screens/AssignedRoutes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PendingRoutesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PendingRoutesList"
      component={PendingRoutes}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PendingRouteDetails"
      component={PendingRouteDetails}
      options={{ title: 'Detalle de Ruta' }}
    />
  </Stack.Navigator>
);

const AssignedRoutesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AssignedRoutesList"
      component={AssignedRoutes}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AssignedRouteDetails"
      component={AssignedRouteDetails}
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
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: Platform.OS === 'android' ? 70 : 80,
          paddingBottom: Platform.OS === 'android' ? 10 : 20,
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="PendingRoutes"
        component={PendingRoutesStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Rutas',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AssignedRoutes"
        component={AssignedRoutesStack}
        options={{
          headerShown: false,
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
  </SafeAreaView>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={Tabs} />
  </Stack.Navigator>
);

export default AppNavigator;
