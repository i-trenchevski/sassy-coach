import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// DEV: fire every 2 minutes so you can test quickly
const DEV_INTERVAL_SECONDS = __DEV__ ? 120 : null;

const NOTIFICATION_CONTENT = {
  title: "Time for your daily mission! 💪",
  body: "Your sassy coach is waiting. Don't make them wait.",
};

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<boolean> {
  const granted = await requestNotificationPermissions();
  if (!granted) return false;

  // Cancel any existing reminders first
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (DEV_INTERVAL_SECONDS) {
    // Dev mode: repeat every 2 minutes
    await Notifications.scheduleNotificationAsync({
      content: NOTIFICATION_CONTENT,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: DEV_INTERVAL_SECONDS,
        repeats: true,
      },
    });
  } else {
    // Production: daily at the configured time
    await Notifications.scheduleNotificationAsync({
      content: NOTIFICATION_CONTENT,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }

  return true;
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function setupNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
