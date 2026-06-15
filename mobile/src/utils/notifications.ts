import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const result = await Notifications.requestPermissionsAsync();
  return (result as { granted?: boolean; status?: string }).granted === true
    || (result as { granted?: boolean; status?: string }).status === 'granted';
}

export async function scheduleTaskNotification(taskId: string, title: string, dueDate: Date): Promise<void> {
  // Cancel existing notification for this task
  await cancelTaskNotification(taskId);

  const trigger = new Date(dueDate);
  trigger.setHours(9, 0, 0, 0); // 9h00 le jour J

  // Don't schedule if date is in the past
  if (trigger <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `task-${taskId}`,
    content: {
      title: '📋 Rappel de tâche',
      body: title,
      data: { taskId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
}

export async function cancelTaskNotification(taskId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
  } catch {}
}
