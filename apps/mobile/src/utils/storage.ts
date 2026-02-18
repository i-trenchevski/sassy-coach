import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, DailyMission } from "@sassy-coach/shared";

const KEYS = {
  USER: "user",
  MISSIONS: "missions",
  ONBOARDING: "onboardingComplete",
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

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.USER, KEYS.MISSIONS, KEYS.ONBOARDING]);
}
