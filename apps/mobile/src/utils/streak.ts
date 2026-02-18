import { getToday, getYesterday } from "./dates";

interface StreakResult {
  newStreak: number;
  wasReset: boolean;
}

export function computeStreak(
  lastCompletedDate: string | null,
  currentStreak: number
): StreakResult {
  const today = getToday();
  const yesterday = getYesterday();

  if (lastCompletedDate === today) {
    return { newStreak: currentStreak, wasReset: false };
  }

  if (lastCompletedDate === yesterday) {
    return { newStreak: currentStreak + 1, wasReset: false };
  }

  return { newStreak: 1, wasReset: true };
}

export function getMilestone(streakCount: number): 7 | 30 | null {
  if (streakCount === 7) return 7;
  if (streakCount === 30) return 30;
  return null;
}
