import { Platform } from 'react-native';

let Notifications: typeof import('expo-notifications') | null = null;
try {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {
  // expo-notifications not available (dev build without native module)
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web' || !Notifications) return false;
  const result = await Notifications.requestPermissionsAsync();
  return (result as any).granted === true || (result as any).status === 'granted';
}

export async function scheduleTaskNotification(taskId: string, title: string, dueDate: Date): Promise<void> {
  if (!Notifications) return;
  await cancelTaskNotification(taskId);
  const trigger = new Date(dueDate);
  trigger.setHours(9, 0, 0, 0);
  if (trigger <= new Date()) return;
  await Notifications.scheduleNotificationAsync({
    identifier: `task-${taskId}`,
    content: { title: '📋 Rappel de tâche', body: title, data: { taskId } },
    trigger: { type: (Notifications as any).SchedulableTriggerInputTypes.DATE, date: trigger },
  });
}

export async function cancelTaskNotification(taskId: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
  } catch {}
}
