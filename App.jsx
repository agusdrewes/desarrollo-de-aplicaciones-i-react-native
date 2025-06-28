import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
  const { getPendingRoutes } = useRoutesService();

  useEffect(() => {
    async function setupNotifications() {
      try {
        //Configure new pending routes notifications
        await configureNotifications();

        const permissionsGranted = await requestNotificationPermissions();
        if (!permissionsGranted) {
          console.log('No se otorgaron permisos de notificación');
          return;
        }

        startPeriodicNotifications(
          getPendingRoutes,
          'Hay nuevas rutas disponibles!',
          'Se han encontrado nuevas rutas que pueden interesarte.',
          1
        ); // Iniciar notificaciones cada 1 minuto
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
  }, [getPendingRoutes]);

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
