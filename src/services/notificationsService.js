import * as Notifications from 'expo-notifications';

let previousIds = null;

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
 *
 * @param {function} dataFetcher
 * @param {string} title
 * @param {string} message
 * @param {number} intervalMinutes
 * @returns
 */
export function startPeriodicNotifications(dataFetcher, title, message, intervalMinutes = 1) {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[Notification] Iniciando notificaciones periódicas cada ${intervalMinutes} minutos`);

  notificationInterval = setInterval(async () => {
    try {
      console.log('[Notification] Verificando datos');
      const response = await dataFetcher();
      const currentData = response.data;

      // Extract IDs from the response data
      const currentIds = Array.isArray(currentData)
        ? currentData.map(item => item.id).filter(id => id !== undefined)
        : [];

      if (!previousIds) {
        console.log('[Notification] No hay IDs anteriores, guardando los actuales');
        previousIds = [...currentIds];
        return; // No enviar notificación en el primer ciclo
      }

      // Find new IDs that weren't in the previous response
      const newIds = currentIds.filter(id => !previousIds.includes(id));

      //This avoids sending notifications if an id is missing in the new response (that route has been taken)
      if (newIds.length > 0) {
        console.log(`[Notification] Encontrados ${newIds.length} nuevos IDs:`, newIds);
        previousIds = [...currentIds];
        await sendNotification(title, message);
        console.log('[Notification] Notificación enviada - nuevos datos detectados');
      } else {
        console.log('[Notification] No se encontraron nuevos IDs');
        // Update previousIds to current ones (in case some were removed)
        previousIds = [...currentIds];
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
