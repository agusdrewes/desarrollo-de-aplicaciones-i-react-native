import { useAxios } from '../hooks/useAxios';
import { Alert } from 'react-native';

export const useQRCodeService = () => {
  const {axiosInstance} = useAxios();
  
  const processQRCode = async (qrData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        timestamp: new Date().toISOString(),
        processedData: qrData,
        message: 'QR code processed successfully'
      };
    } catch (error) {
      console.error('Error processing QR code:', error);
      throw error;
    }
  };

const assignPackageFromQRCode = async (qrData, onFinish) => {
  try {
    // Intentamos parsear el string escaneado como JSON
    const parsed = JSON.parse(qrData);

    const id = parsed.id;
    const confirmationCode = parsed.assignmentConfirmationCode;
    const clientName = parsed.clientName;
    const address = parsed.destination?.address;
    const warehouse = parsed.warehouse?.name;

    if (!id || !confirmationCode) {
      throw new Error('Faltan datos en el código QR');
    }

    Alert.alert(
      'Asignar paquete',
      `¿Deseás tomar el paquete para:\n\n📦 Cliente: ${clientName}\n🏬 Almacén: ${warehouse}\n📍 Dirección: ${address}`,
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
              await axiosInstance.post(`/routes/${id}/assign/${confirmationCode}`);
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
          onPress: () => onFinish?.(), // 🔒 Espera a que el usuario cierre la alerta
        },
      ]
    );
  }
};

  return {
    processQRCode,
    assignPackageFromQRCode
  };
};