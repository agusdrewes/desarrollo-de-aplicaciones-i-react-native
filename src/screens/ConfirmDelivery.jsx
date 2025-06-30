import { StyleSheet, View } from 'react-native';
import { useOtpVerification } from '../hooks/useOtpVerification';
import { useRoutesService } from '../services/routesService';
import OtpForm from '../components/otp/OtpForm';

export default function ConfirmDelivery({ navigation, route }) {
  const { deliveryId, deliveryDetails } = route.params;
  const { otp, setOtp, loading, handleVerify } = useOtpVerification();
  const { deliverAsignedRoute } = useRoutesService();

  const handleConfirmDelivery = () => {
    handleVerify({
      verificationFunction: (otpCode) => deliverAsignedRoute(deliveryId, otpCode),
      successMessage: 'Entrega confirmada exitosamente. El estado ha sido actualizado.',
      errorMessage: 'Error al confirmar la entrega. Verifica el código e inténtalo de nuevo.',
      onSuccess: () => {
        navigation.navigate('AssignedRouteDetails', { id: deliveryId });  
      },
      onCancel: () => navigation.goBack(),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <OtpForm
        titleText="Ingresá el código de confirmación para completar la entrega"
        acceptButtonText="Confirmar Entrega"
        cancelButtonText="Cancelar"
        onCancel={handleCancel}
        onAccept={handleConfirmDelivery}
        onChange={setOtp}
        value={otp}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
}); 