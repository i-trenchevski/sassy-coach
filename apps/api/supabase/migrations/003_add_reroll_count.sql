-- Add reroll_count to daily_missions (was missing from initial schema)
ALTER TABLE daily_missions ADD COLUMN IF NOT EXISTS reroll_count INTEGER NOT NULL DEFAULT 0;
