import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import ConfirmSignup from './src/screens/ConfirmSignup';
import ConfirmPassword from './src/screens/ConfirmPassword'
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ConfirmSignup" component={ConfirmSignup} />
        <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f6f6f6',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
