import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Welcome to DeRemate App!
      </Text>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('Login')} style={styles.button}>
          Go to Login Screen
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ConfirmSignup')}
          style={styles.button}
        >
          Go to Confirm Signup Screen
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ConfirmPassword')}
          style={styles.button}
        >
          Go to Confirm Password Screen
        </Button>
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
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});
