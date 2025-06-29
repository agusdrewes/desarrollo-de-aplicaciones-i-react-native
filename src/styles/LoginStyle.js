import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FDF5F5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;