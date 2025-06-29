import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, ActivityIndicator, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useRoutesService } from '../services/routesService';


const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const isProcessingRef = useRef(false);
  const route = useRoute();
  const { id } = route.params || {};

  const { assignRoute, getUnassignedRouteById } = useRoutesService();


  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true); 
      setScanned(false);
      isProcessingRef.current = false;

      return () => {
        setIsFocused(false); 
      };
    }, [])
  );

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (isProcessingRef.current) {
      console.log('Ya se está procesando un QR, ignorando...');
      return;
    }

    console.log('Procesando QR:', data);
    isProcessingRef.current = true;
    setScanned(true);
    setLoading(true);

    try {
      await assignPackageFromQRCode(data, () => {
        setScanned(false);
        isProcessingRef.current = false;
      }, id);
    } catch (error) {
      Alert.alert('Error', `Error al procesar el código QR: ${error.message}`, [
        {
          text: 'Aceptar',
          onPress: () => {
            setScanned(false);
            isProcessingRef.current = false;
          },
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

  const assignPackageFromQRCode = async (qrData, onFinish, id) => {
      try {
        const parsed = JSON.parse(qrData);

        const idQR = parsed.id;
        const confirmationCode = parsed.assignmentConfirmationCode;

        if (!idQR || !confirmationCode) {
          throw new Error('Faltan datos en el código QR');
        }

       if (id && idQR != id) {
      Alert.alert(
        'QR inválido',
        'El código QR no está relacionado con la ruta seleccionada.',
        [
          {
            text: 'Aceptar',
            onPress: () => onFinish?.(), 
          },
        ]
      );
      return;
    }

    const res = await getUnassignedRouteById(idQR);

          Alert.alert(
            'Asignar paquete',
            `¿Deseás tomar el paquete para:\n\n📦 Cliente: ${res.data.clientName}\n🏬 Almacén: ${res.data.warehouse.name}\n📍 Dirección: ${res.data.destination.address}`,
            [
              {
                text: 'Cancelar',
                style: 'cancel',
                onPress: () => onFinish?.(),
              },
              {
                text: 'Aceptar',
                onPress: async () => {
                  try {
                    await assignRoute(idQR, confirmationCode);
                    Alert.alert('Asignado', 'El paquete fue asignado correctamente.');
                  } catch (error) {
                    Alert.alert('Error', `No se pudo asignar el paquete: ${error.message}`);
                  } finally {
                    onFinish?.();
                  }
                },
              },
            ]
          );
        } catch (e) {
          Alert.alert(
            'QR inválido',
            'El código QR no tiene un formato JSON válido.',
            [
              {
                text: 'Aceptar',
                onPress: () => onFinish?.(), 
              },
            ]
          );
        }
      };

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
          onBarcodeScanned={isProcessingRef.current ? undefined : handleBarCodeScanned}
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
