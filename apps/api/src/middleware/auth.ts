import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Extend Express Request to include authenticated user info
declare global {
  namespace Express {
    interface Request {
      authUserId?: string;
      authEmail?: string;
      appUserId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing authorization token" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    // Verify the JWT using Supabase's getUser (validates against auth server)
    const supabase = createClient(supabaseUrl, supabaseKey);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("[Auth] Token validation failed:", error?.message);
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.authUserId = user.id;
    req.authEmail = user.email ?? undefined;

    // Look up the app user by auth_id
    const { data: appUser, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (lookupError && lookupError.code !== "PGRST116") {
      // PGRST116 = no rows found (expected for new users), anything else is a real error
      console.error("[Auth] User lookup error:", lookupError.message);
    }

    if (appUser) {
      req.appUserId = appUser.id;
    } else {
      console.log(`[Auth] No app user found for auth_id=${user.id} (${req.method} ${req.path})`);
    }

    next();
  } catch (err) {
    console.error("[Auth] Unexpected error:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
}
