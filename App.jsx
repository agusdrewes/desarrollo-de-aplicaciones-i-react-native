import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import ForgotPassword from './src/screens/ForgotPassword';
import ConfirmSignup from './src/screens/ConfirmSignup';
import ConfirmPassword from './src/screens/ConfirmPassword';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  configureNotifications,
  requestNotificationPermissions,
  startPeriodicNotifications,
  stopPeriodicNotifications,
} from './src/services/notificationsService';
import { useRoutesService } from './src/services/routesService';

//Silence console logs, warnings, and errors (we need to make this configurable later)
// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};

const Stack = createNativeStackNavigator();

// Component to handle notifications inside NavigationContainer
function NotificationHandler() {
  const { getPendingRoutes, getAssignedRoutes } = useRoutesService();
  const navigation = useNavigation();

  // Handle notification click
  const handleNotificationClick = data => {
    console.log('[NotificationHandler] Notification clicked with data:', data);

    if (data.notificationId === 'pending-routes') {
      // Navigate to pending routes screen
      navigation.navigate('PendingRoutes');
    } else if (data.notificationId === 'assigned-routes') {
      // Navigate to assigned routes screen
      navigation.navigate('AssignedRoutes');
    }
  };

  // Data mapping function: extract IDs from response
  const mapRouteData = data => {
    return Array.isArray(data) ? data.map(item => item.id).filter(id => id !== undefined) : [];
  };

  // Change detection function: check for new IDs only (ignore removals)
  const detectNewRoutes = (currentIds, previousIds) => {
    if (!Array.isArray(currentIds) || !Array.isArray(previousIds)) {
      return false;
    }

    const newIds = currentIds.filter(id => !previousIds.includes(id));
    if (newIds.length > 0) {
      console.log(`[NotificationHandler] Encontrados ${newIds.length} nuevos IDs:`, newIds);
      return true;
    }
    return false;
  };

  useEffect(() => {
    async function setupNotifications() {
      try {
        //Configure notifications with click handler
        await configureNotifications(handleNotificationClick);

        const permissionsGranted = await requestNotificationPermissions();
        if (!permissionsGranted) {
          console.log('No se otorgaron permisos de notificación');
          return;
        }

        // Setup pending routes notifications
        startPeriodicNotifications(
          'pending-routes',
          getPendingRoutes,
          mapRouteData,
          detectNewRoutes,
          'Hay nuevas rutas disponibles! 📍',
          'Se han encontrado nuevas rutas que pueden interesarte.',
          10
        ); // Check every 1 minute

        // Setup assigned routes notifications
        startPeriodicNotifications(
          'assigned-routes',
          getAssignedRoutes,
          mapRouteData,
          detectNewRoutes,
          'Tenés nuevas rutas asignadas! 🏍️',
          'Se te han asignado nuevas rutas para completar.',
          10
        ); // Check every 1 minute
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    }

    setupNotifications();

    return () => {
      // Limpiar cuando el componente se desmonta
      try {
        stopPeriodicNotifications();
      } catch (e) {
        console.error('Error al detener notificaciones:', e);
      }
    };
  }, [getPendingRoutes, getAssignedRoutes]);

  return null; // This component doesn't render anything
}

function AppContent() {
  const { isAuthenticated } = React.useContext(AuthContext);

  // Show loading screen or splash screen while checking authentication status
  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  //Vamos agregando al Stack.Navigator las pantallas individuales, después las unimos
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <>
          <NotificationHandler />
          <AppNavigator />
        </>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ConfirmSignup" component={ConfirmSignup} />
          <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
