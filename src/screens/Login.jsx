import { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <View>
      <Text>Login</Text>
      <Button title="Iniciar sesión" onPress={login} />
    </View>
  );
};
