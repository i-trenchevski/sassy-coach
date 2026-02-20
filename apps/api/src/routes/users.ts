import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { mapUserRow } from "../utils/mappers";
import type {
  RegisterUserRequest,
  UpdateUserRequest,
} from "@sassy-coach/shared";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authId = req.authUserId!;
      const authEmail = req.authEmail ?? null;
      const { goal, tone, timezone } = req.body as RegisterUserRequest;

      // Check if user already exists for this auth account
      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authId)
        .single();

      if (existing) {
        // Returning user — update preferences but preserve streak data
        const { data, error } = await supabase
          .from("users")
          .update({
            email: authEmail,
            goal,
            tone,
            timezone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        res.json({ user: mapUserRow(data!) });
        return;
      }

      // New user — generate an app-level ID
      const appUserId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const { data, error } = await supabase
        .from("users")
        .insert({
          id: appUserId,
          auth_id: authId,
          email: authEmail,
          goal,
          tone,
          is_premium: false,
          timezone,
          streak_count: 0,
          last_completed_date: null,
          last_generated_date: null,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ user: mapUserRow(data!) });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId;

      if (!userId) {
        res
          .status(404)
          .json({ error: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        res
          .status(404)
          .json({ error: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      res.json({ user: mapUserRow(data) });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.appUserId;

      if (!userId) {
        res
          .status(404)
          .json({ error: "User not found", code: "USER_NOT_FOUND" });
        return;
      }

      const { goal, tone, timezone } = req.body as UpdateUserRequest;

      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (goal !== undefined) updates.goal = goal;
      if (tone !== undefined) updates.tone = tone;
      if (timezone !== undefined) updates.timezone = timezone;

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      res.json({ user: mapUserRow(data!) });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
