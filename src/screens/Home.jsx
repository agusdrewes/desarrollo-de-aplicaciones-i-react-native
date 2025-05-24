import { View, Text, StyleSheet, Button } from 'react-native';

export default Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DeRemate App!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Go to Login Screen" onPress={() => navigation.navigate('Login')} />
        <View style={styles.buttonSpacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  buttonSpacer: {
    height: 20,
  },
});
