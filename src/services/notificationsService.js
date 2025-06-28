import * as Notifications from 'expo-notifications';

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

let notificationIntervals = new Map();

/**
 * Start periodic notifications with configurable data mapping and comparison
 * @param {string} notificationId - Unique identifier for this notification type
 * @param {function} dataFetcher - Function that fetches the data
 * @param {function} dataMapper - Function to extract comparable data from response
 * @param {function} changeDetector - Function to detect if notification should be sent
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {number} intervalMinutes - Check interval in minutes
 * @returns {boolean}
 */
export async function startPeriodicNotifications(
  notificationId,
  dataFetcher,
  dataMapper,
  changeDetector,
  title,
  message,
  intervalMinutes = 1
) {
  // Clear existing interval for this notification type if it exists
  if (notificationIntervals.has(notificationId)) {
    const existing = notificationIntervals.get(notificationId);
    clearInterval(existing.interval);
  }

  // Fetch initial data and set up the interval
  const response = await dataFetcher();
  let previousData = dataMapper(response.data);
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(
    `[Notification] Iniciando notificaciones periódicas "${notificationId}" cada ${intervalMinutes} minutos`
  );

  const interval = setInterval(async () => {
    try {
      console.log(`[Notification] Verificando datos para "${notificationId}"`);
      const response = await dataFetcher();
      const currentData = dataMapper(response.data);

      if (!previousData) {
        console.log(
          `[Notification] No hay datos anteriores para "${notificationId}", guardando los actuales`
        );
        previousData = currentData;
        return; // No enviar notificación en el primer ciclo
      }

      const shouldNotify = changeDetector(currentData, previousData);

      if (shouldNotify) {
        console.log(
          `[Notification] Cambios detectados en "${notificationId}", enviando notificación`
        );
        previousData = currentData;
        await sendNotification(title, message);
        console.log(
          `[Notification] Notificación enviada para "${notificationId}" - nuevos datos detectados`
        );
      } else {
        console.log(
          `[Notification] No se detectaron cambios que requieran notificación para "${notificationId}"`
        );
        // Update previousData to current ones (in case some were removed)
        previousData = currentData;
      }
    } catch (error) {
      console.error(`[Notification] Error en "${notificationId}":`, error);
    }
  }, intervalMs);

  // Store the interval and its associated data
  notificationIntervals.set(notificationId, {
    interval: interval,
    previousData: previousData,
  });

  return true;
}

export function stopPeriodicNotifications() {
  // Stop all notifications
  let stoppedCount = 0;
  for (const [id, data] of notificationIntervals) {
    clearInterval(data.interval);
    stoppedCount++;
  }
  notificationIntervals.clear();
  console.log(`[Notification] ${stoppedCount} notificaciones periódicas detenidas`);
  return stoppedCount > 0;
}
