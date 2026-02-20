import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, DailyMission } from "@sassy-coach/shared";

const KEYS = {
  USER: "user",
  MISSIONS: "missions",
  ONBOARDING: "onboardingComplete",
  NOTIFICATION_ENABLED: "notificationEnabled",
  NOTIFICATION_HOUR: "notificationHour",
  NOTIFICATION_MINUTE: "notificationMinute",
} as const;

export async function getUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function getMissions(): Promise<DailyMission[]> {
  const raw = await AsyncStorage.getItem(KEYS.MISSIONS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMissions(missions: DailyMission[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDING);
  return value === "true";
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, "true");
}

export async function getNotificationPrefs(): Promise<{
  enabled: boolean;
  hour: number;
  minute: number;
}> {
  const [enabled, hour, minute] = await AsyncStorage.multiGet([
    KEYS.NOTIFICATION_ENABLED,
    KEYS.NOTIFICATION_HOUR,
    KEYS.NOTIFICATION_MINUTE,
  ]);
  return {
    enabled: enabled[1] === "true",
    hour: hour[1] != null ? parseInt(hour[1]) : 9,
    minute: minute[1] != null ? parseInt(minute[1]) : 0,
  };
}

export async function saveNotificationPrefs(
  enabled: boolean,
  hour: number,
  minute: number
): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.NOTIFICATION_ENABLED, String(enabled)],
    [KEYS.NOTIFICATION_HOUR, String(hour)],
    [KEYS.NOTIFICATION_MINUTE, String(minute)],
  ]);
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.USER, KEYS.MISSIONS, KEYS.ONBOARDING]);
  // Note: notification prefs are device-specific, intentionally NOT cleared on reset
}
