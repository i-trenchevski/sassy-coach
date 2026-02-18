import { useMemo } from "react";
import { getToday } from "@/utils/dates";
import { computeStreak, getMilestone } from "@/utils/streak";

interface UseStreakResult {
  currentStreak: number;
  isCompletedToday: boolean;
  milestone: 7 | 30 | null;
}

export function useStreak(
  lastCompletedDate: string | null,
  streakCount: number
): UseStreakResult {
  return useMemo(() => {
    const isCompletedToday = lastCompletedDate === getToday();
    const { newStreak } = computeStreak(lastCompletedDate, streakCount);
    const milestone = getMilestone(newStreak);

    return {
      currentStreak: isCompletedToday ? streakCount : newStreak,
      isCompletedToday,
      milestone: isCompletedToday ? milestone : null,
    };
  }, [lastCompletedDate, streakCount]);
}
