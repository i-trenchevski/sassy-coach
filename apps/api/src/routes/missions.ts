import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { generateMission } from "../lib/openai";
import { mapMissionRow, mapUserRow } from "../utils/mappers";
import { getToday } from "../utils/dates";
import { computeStreak } from "../utils/streak";
import { pickMission } from "../utils/fallbackMissions";
import type {
  GenerateMissionRequest,
  CompleteMissionRequest,
} from "@sassy-coach/shared";

const router = Router();

router.post(
  "/generate-mission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, goal, tone } = req.body as GenerateMissionRequest;
      const today = getToday();

      // Check if mission already exists for today (idempotency)
      const { data: existing } = await supabase
        .from("daily_missions")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        res.json({ mission: mapMissionRow(existing), fromCache: true });
        return;
      }

      // Get recent tasks to avoid repetition
      const { data: recentMissions } = await supabase
        .from("daily_missions")
        .select("task")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(7);

      const recentTasks = (recentMissions || []).map(
        (m: Record<string, unknown>) => m.task as string
      );

      // Generate via OpenAI with fallback to mock pool
      let missionContent: {
        task: string;
        sass: string;
        reflectionQuestion: string;
      };

      try {
        missionContent = await generateMission(goal, tone, recentTasks);
      } catch (aiError) {
        console.warn("[AI Fallback] OpenAI failed, using mock pool:", aiError);
        const template = pickMission(goal, recentTasks);
        missionContent = {
          task: template.task,
          sass: template.sass[tone],
          reflectionQuestion: template.reflectionQuestion,
        };
      }

      // Store in Supabase
      const missionId = `mission-${today}-${userId}`;
      const { data: newMission, error } = await supabase
        .from("daily_missions")
        .insert({
          id: missionId,
          user_id: userId,
          date: today,
          task: missionContent.task,
          sass: missionContent.sass,
          reflection_question: missionContent.reflectionQuestion,
          completed: false,
          reflection_answer: null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update user's lastGeneratedDate
      await supabase
        .from("users")
        .update({ last_generated_date: today })
        .eq("id", userId);

      res
        .status(201)
        .json({ mission: mapMissionRow(newMission!), fromCache: false });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/complete-mission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { missionId, reflectionAnswer } =
        req.body as CompleteMissionRequest;

      // Mark mission as completed
      const { data: mission, error: missionError } = await supabase
        .from("daily_missions")
        .update({
          completed: true,
          reflection_answer: reflectionAnswer,
          updated_at: new Date().toISOString(),
        })
        .eq("id", missionId)
        .select()
        .single();

      if (missionError || !mission) {
        res
          .status(404)
          .json({ error: "Mission not found", code: "MISSION_NOT_FOUND" });
        return;
      }

      // Get user and compute new streak
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", mission.user_id)
        .single();

      if (!user) {
        res
          .status(404)
          .json({ error: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      const { newStreak } = computeStreak(
        user.last_completed_date,
        user.streak_count
      );
      const today = getToday();

      // Update user streak
      const { error: userError } = await supabase
        .from("users")
        .update({
          streak_count: newStreak,
          last_completed_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("id", mission.user_id);

      if (userError) throw userError;

      res.json({
        mission: mapMissionRow(mission),
        streakCount: newStreak,
        lastCompletedDate: today,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/history/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 30;

      const { data, error } = await supabase
        .from("daily_missions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(limit);

      if (error) throw error;

      res.json({ missions: (data || []).map(mapMissionRow) });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
