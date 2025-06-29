import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, ActivityIndicator, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQRCodeService } from '../services/qrCodeService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { assignPackageFromQRCode } = useQRCodeService();
  const [permission, requestPermission] = useCameraPermissions();

  // Maneja el ciclo de vida de la pantalla
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true); // se enfoca la pantalla

      return () => {
        setIsFocused(false); // se desenfoca o desmonta
      };
    }, [])
  );

  // Solicita permisos al montar
  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setLoading(true);

    try {
      await assignPackageFromQRCode(data, () => setScanned(false));
    } catch (error) {
      Alert.alert('Error', `Error al procesar el código QR: ${error.message}`, [
        {
          text: 'Aceptar',
          onPress: () => setScanned(false),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hay acceso a la cámara</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Volver
        </Button>
      </View>
    );
  }

  return (
    <Surface style={[styles.container, { paddingTop: insets.top }]}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.goBack()}
              style={[styles.button, { marginTop: 10 }]}
            >
              Volver
            </Button>
          </View>
        </CameraView>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    borderRadius: 8,
  },
});

export default QRScanner;
