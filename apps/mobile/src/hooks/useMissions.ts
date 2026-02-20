import { useState, useEffect, useCallback } from "react";
import type { DailyMission, Goal, Tone } from "@sassy-coach/shared";
import { getMissions, saveMissions } from "@/utils/storage";
import { getToday } from "@/utils/dates";
import { pickMission } from "@/constants/mockMissions";
import { api } from "@/utils/api";

const MAX_REROLLS = 2; // initial + 2 rerolls = 3 missions max per day

export function useMissions() {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const stored = await getMissions();
    if (stored.length > 0) {
      setMissions(stored);
    }

    // Always try to sync from API (restores history after re-login when cache is empty)
    try {
      const { missions: remote } = await api.getHistory();
      if (remote.length > 0) {
        setMissions(remote);
        await saveMissions(remote);
      }
    } catch {
      // API unreachable — use cached data if available
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Find today's mission: exact date match, or most recent incomplete mission
  const todayMission =
    missions.find((m) => m.date === getToday()) ??
    [...missions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .find((m) => !m.completed) ??
    null;

  const rerollsRemaining = todayMission
    ? MAX_REROLLS - (todayMission.rerollCount ?? 0)
    : MAX_REROLLS;

  const generateTodayMission = useCallback(
    async (goal: Goal, tone: Tone) => {
      // If there's already an incomplete mission, return it
      const incomplete = [...missions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .find((m) => !m.completed);
      if (incomplete) return incomplete;

      let mission: DailyMission;

      try {
        // Try API first (pool or AI-generated mission)
        const { mission: remoteMission } = await api.generateMission({
          goal,
          tone,
        });
        mission = remoteMission;
      } catch {
        // Fallback to local mock generation
        const today = getToday();
        const recentTasks = missions.slice(-7).map((m) => m.task);
        const template = pickMission(goal, recentTasks);
        mission = {
          id: `mission-${today}-fallback`,
          userId: "local",
          date: today,
          task: template.task,
          sass: template.sass[tone],
          reflectionQuestion: template.reflectionQuestion,
          completed: false,
          reflectionAnswer: null,
          rerollCount: 0,
        };
      }

      // Add mission, avoiding duplicates
      const exists = missions.some((m) => m.id === mission.id);
      const updated = exists ? missions : [...missions, mission];
      setMissions(updated);
      await saveMissions(updated);
      return mission;
    },
    [missions]
  );

  const rerollMission = useCallback(
    async (goal: Goal, tone: Tone) => {
      if (!todayMission || rerollsRemaining <= 0) return;

      let newMission: DailyMission;

      try {
        const { mission } = await api.rerollMission({ goal, tone });
        newMission = mission;
      } catch {
        // Fallback to local mock generation
        const recentTasks = missions.slice(-7).map((m) => m.task);
        recentTasks.push(todayMission.task); // exclude current mission
        const template = pickMission(goal, recentTasks);
        newMission = {
          ...todayMission,
          task: template.task,
          sass: template.sass[tone],
          reflectionQuestion: template.reflectionQuestion,
          rerollCount: (todayMission.rerollCount ?? 0) + 1,
        };
      }

      const updated = missions.map((m) =>
        m.id === todayMission.id ? newMission : m
      );
      setMissions(updated);
      await saveMissions(updated);
      return newMission;
    },
    [missions, todayMission, rerollsRemaining]
  );

  const completeMission = useCallback(
    async (
      missionId: string,
      reflectionAnswer: string | null
    ): Promise<{ streakCount: number; lastCompletedDate: string } | null> => {
      let serverStreak: {
        streakCount: number;
        lastCompletedDate: string;
      } | null = null;

      try {
        const response = await api.completeMission({
          missionId,
          reflectionAnswer,
        });
        serverStreak = {
          streakCount: response.streakCount,
          lastCompletedDate: response.lastCompletedDate,
        };
      } catch {
        // API failed — still update locally
      }

      const updated = missions.map((m) =>
        m.id === missionId
          ? { ...m, completed: true, reflectionAnswer }
          : m
      );
      setMissions(updated);
      await saveMissions(updated);

      return serverStreak;
    },
    [missions]
  );

  return {
    missions,
    todayMission,
    rerollsRemaining,
    loading,
    reload,
    generateTodayMission,
    rerollMission,
    completeMission,
  };
}
