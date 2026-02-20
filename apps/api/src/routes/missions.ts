import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { generateMission } from "../lib/openai";
import { mapMissionRow } from "../utils/mappers";
import { getToday } from "../utils/dates";
import { computeStreak } from "../utils/streak";
import { pickMission } from "../utils/fallbackMissions";
import type {
  GenerateMissionRequest,
  CompleteMissionRequest,
  RerollMissionRequest,
} from "@sassy-coach/shared";

const router = Router();

router.post(
  "/generate-mission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId!;
      const { goal, tone } = req.body as GenerateMissionRequest;
      const today = getToday();

      // Check if mission already exists for today (idempotency)
      const { data: existing } = await supabase
        .from("daily_missions")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (existing) {
        res.json({
          mission: mapMissionRow(existing),
          fromCache: true,
          rerollsRemaining: MAX_REROLLS - (existing.reroll_count ?? 0),
        });
        return;
      }

      // Try to pick an unseen mission from the pool
      let missionContent: {
        task: string;
        sass: string;
        reflectionQuestion: string;
      } | null = null;

      const { data: poolMission } = await supabase
        .from("mission_pool")
        .select("*")
        .eq("goal", goal)
        .eq("tone", tone)
        .not(
          "id",
          "in",
          `(SELECT pool_mission_id FROM user_pool_missions WHERE user_id = '${userId}')`
        )
        .limit(1)
        .single();

      if (poolMission) {
        missionContent = {
          task: poolMission.task,
          sass: poolMission.sass,
          reflectionQuestion: poolMission.reflection_question,
        };

        // Track that this user has seen this pool mission
        await supabase.from("user_pool_missions").insert({
          user_id: userId,
          pool_mission_id: poolMission.id,
          served_date: today,
        });
      }

      // Pool empty for this user — fall back to OpenAI, then mock
      if (!missionContent) {
        const { data: recentMissions } = await supabase
          .from("daily_missions")
          .select("task")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(7);

        const recentTasks = (recentMissions || []).map(
          (m: Record<string, unknown>) => m.task as string
        );

        try {
          missionContent = await generateMission(goal, tone, recentTasks);
        } catch (aiError) {
          console.warn(
            "[AI Fallback] OpenAI failed, using mock pool:",
            aiError
          );
          const template = pickMission(goal, recentTasks);
          missionContent = {
            task: template.task,
            sass: template.sass[tone],
            reflectionQuestion: template.reflectionQuestion,
          };
        }
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
          reroll_count: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("[generate-mission] DB insert failed:", error.message, error.details);
        throw error;
      }

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

const MAX_REROLLS = 2; // initial + 2 rerolls = 3 missions max per day

router.post(
  "/reroll-mission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId!;
      const { goal, tone } = req.body as RerollMissionRequest;
      const today = getToday();

      // Get today's existing mission
      const { data: existing } = await supabase
        .from("daily_missions")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (!existing) {
        res
          .status(400)
          .json({ error: "No mission to reroll", code: "NO_MISSION" });
        return;
      }

      if (existing.completed) {
        res
          .status(400)
          .json({ error: "Cannot reroll a completed mission", code: "ALREADY_COMPLETED" });
        return;
      }

      const currentRerolls = existing.reroll_count ?? 0;
      if (currentRerolls >= MAX_REROLLS) {
        res
          .status(400)
          .json({ error: "No rerolls remaining", code: "MAX_REROLLS_REACHED" });
        return;
      }

      // Generate new mission content
      let missionContent: {
        task: string;
        sass: string;
        reflectionQuestion: string;
      } | null = null;

      // Try pool first
      const { data: poolMission } = await supabase
        .from("mission_pool")
        .select("*")
        .eq("goal", goal)
        .eq("tone", tone)
        .not(
          "id",
          "in",
          `(SELECT pool_mission_id FROM user_pool_missions WHERE user_id = '${userId}')`
        )
        .limit(1)
        .single();

      if (poolMission) {
        missionContent = {
          task: poolMission.task,
          sass: poolMission.sass,
          reflectionQuestion: poolMission.reflection_question,
        };

        await supabase.from("user_pool_missions").insert({
          user_id: userId,
          pool_mission_id: poolMission.id,
          served_date: today,
        });
      }

      // Fallback to AI / mock
      if (!missionContent) {
        const { data: recentMissions } = await supabase
          .from("daily_missions")
          .select("task")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(7);

        const recentTasks = (recentMissions || []).map(
          (m: Record<string, unknown>) => m.task as string
        );
        // Also exclude the current mission's task
        recentTasks.push(existing.task as string);

        try {
          missionContent = await generateMission(goal, tone, recentTasks);
        } catch {
          const template = pickMission(goal, recentTasks);
          missionContent = {
            task: template.task,
            sass: template.sass[tone],
            reflectionQuestion: template.reflectionQuestion,
          };
        }
      }

      const newRerollCount = currentRerolls + 1;

      // Update existing mission with new content
      const { data: updated, error } = await supabase
        .from("daily_missions")
        .update({
          task: missionContent.task,
          sass: missionContent.sass,
          reflection_question: missionContent.reflectionQuestion,
          reroll_count: newRerollCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        mission: mapMissionRow(updated!),
        rerollsRemaining: MAX_REROLLS - newRerollCount,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/complete-mission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId!;
      const { missionId, reflectionAnswer } =
        req.body as CompleteMissionRequest;

      // Verify mission belongs to this user
      const { data: missionCheck } = await supabase
        .from("daily_missions")
        .select("user_id")
        .eq("id", missionId)
        .single();

      if (!missionCheck || missionCheck.user_id !== userId) {
        res
          .status(404)
          .json({ error: "Mission not found", code: "MISSION_NOT_FOUND" });
        return;
      }

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
        .eq("id", userId)
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
        .eq("id", userId);

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
  "/history",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId!;
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
