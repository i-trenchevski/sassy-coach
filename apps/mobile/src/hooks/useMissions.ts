import { useState, useEffect, useCallback } from "react";
import type { DailyMission, Goal, Tone } from "@sassy-coach/shared";
import { getMissions, saveMissions } from "@/utils/storage";
import { getToday } from "@/utils/dates";
import { pickMission } from "@/constants/mockMissions";

export function useMissions() {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMissions()
      .then(setMissions)
      .finally(() => setLoading(false));
  }, []);

  const todayMission = missions.find((m) => m.date === getToday()) ?? null;

  const generateTodayMission = useCallback(
    async (userId: string, goal: Goal, tone: Tone) => {
      const today = getToday();
      const existing = missions.find((m) => m.date === today);
      if (existing) return existing;

      const recentTasks = missions.slice(-7).map((m) => m.task);
      const template = pickMission(goal, recentTasks);

      const mission: DailyMission = {
        id: `mission-${today}`,
        userId,
        date: today,
        task: template.task,
        sass: template.sass[tone],
        reflectionQuestion: template.reflectionQuestion,
        completed: false,
        reflectionAnswer: null,
      };

      const updated = [...missions, mission];
      setMissions(updated);
      await saveMissions(updated);
      return mission;
    },
    [missions]
  );

  const completeMission = useCallback(
    async (reflectionAnswer: string | null) => {
      const today = getToday();
      const updated = missions.map((m) =>
        m.date === today
          ? { ...m, completed: true, reflectionAnswer }
          : m
      );
      setMissions(updated);
      await saveMissions(updated);
    },
    [missions]
  );

  return { missions, todayMission, loading, generateTodayMission, completeMission };
}
