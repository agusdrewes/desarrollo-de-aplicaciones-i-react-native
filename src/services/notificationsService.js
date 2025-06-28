import * as Notifications from 'expo-notifications';

let previousData = null;

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}

let notificationInterval = null;

/**
 * Start periodic notifications with configurable data mapping and comparison
 * @param {function} dataFetcher - Function that fetches the data
 * @param {function} dataMapper - Function to extract comparable data from response
 * @param {function} changeDetector - Function to detect if notification should be sent
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {number} intervalMinutes - Check interval in minutes
 * @returns {boolean}
 */
export function startPeriodicNotifications(
  dataFetcher,
  dataMapper,
  changeDetector,
  title,
  message,
  intervalMinutes = 1
) {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[Notification] Iniciando notificaciones periódicas cada ${intervalMinutes} minutos`);

  notificationInterval = setInterval(async () => {
    try {
      console.log('[Notification] Verificando datos');
      const response = await dataFetcher();
      const currentData = dataMapper(response.data);

      if (!previousData) {
        console.log('[Notification] No hay datos anteriores, guardando los actuales');
        previousData = currentData;
        return; // No enviar notificación en el primer ciclo
      }

      const shouldNotify = changeDetector(currentData, previousData);

      if (shouldNotify) {
        console.log('[Notification] Cambios detectados, enviando notificación');
        previousData = currentData;
        await sendNotification(title, message);
        console.log('[Notification] Notificación enviada - nuevos datos detectados');
      } else {
        console.log('[Notification] No se detectaron cambios que requieran notificación');
        // Update previousData to current ones (in case some were removed)
        previousData = currentData;
      }
    } catch (error) {
      console.error('[Notification] Error:', error);
    }
  }, intervalMs);

  return true;
}

export function stopPeriodicNotifications() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    console.log('[Notification] Notificaciones periódicas detenidas');
    return true;
  }
  return false;
}
