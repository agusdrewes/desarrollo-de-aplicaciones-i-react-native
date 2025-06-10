import React from 'react';
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

const Stack = createNativeStackNavigator();

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
        <AppNavigator />
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