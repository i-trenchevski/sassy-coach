import { useState, useEffect, useCallback } from "react";
import type { DailyMission, Goal, Tone } from "@sassy-coach/shared";
import { getMissions, saveMissions } from "@/utils/storage";
import { getToday } from "@/utils/dates";
import { pickMission } from "@/constants/mockMissions";
import { api } from "@/utils/api";

export function useMissions() {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const stored = await getMissions();
    setMissions(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const todayMission = missions.find((m) => m.date === getToday()) ?? null;

  const generateTodayMission = useCallback(
    async (userId: string, goal: Goal, tone: Tone) => {
      const today = getToday();
      const existing = missions.find((m) => m.date === today);
      if (existing) return existing;

      let mission: DailyMission;

      try {
        // Try API first (AI-generated mission)
        const { mission: remoteMission } = await api.generateMission({
          userId,
          goal,
          tone,
        });
        mission = remoteMission;
      } catch {
        // Fallback to local mock generation
        const recentTasks = missions.slice(-7).map((m) => m.task);
        const template = pickMission(goal, recentTasks);
        mission = {
          id: `mission-${today}-${userId}`,
          userId,
          date: today,
          task: template.task,
          sass: template.sass[tone],
          reflectionQuestion: template.reflectionQuestion,
          completed: false,
          reflectionAnswer: null,
        };
      }

      const updated = [...missions, mission];
      setMissions(updated);
      await saveMissions(updated);
      return mission;
    },
    [missions]
  );

  const completeMission = useCallback(
    async (missionId: string, reflectionAnswer: string | null) => {
      const today = getToday();

      try {
        await api.completeMission({ missionId, reflectionAnswer });
      } catch {
        // API failed — still update locally
      }

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

  return {
    missions,
    todayMission,
    loading,
    reload,
    generateTodayMission,
    completeMission,
  };
}
