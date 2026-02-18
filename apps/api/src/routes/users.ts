import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { mapUserRow } from "../utils/mappers";
import type { RegisterUserRequest } from "@sassy-coach/shared";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, goal, tone, timezone } = req.body as RegisterUserRequest;

      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("users")
          .update({
            goal,
            tone,
            timezone,
            streak_count: 0,
            last_completed_date: null,
            last_generated_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        res.json({ user: mapUserRow(data!) });
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          id,
          email: null,
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
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

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

export default router;
