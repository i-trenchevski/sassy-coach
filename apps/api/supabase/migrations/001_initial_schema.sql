-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  goal TEXT NOT NULL CHECK (goal IN ('fitness', 'productivity', 'language', 'job-search', 'custom')),
  tone TEXT NOT NULL CHECK (tone IN ('sassy', 'kind', 'drill-sergeant', 'zen')),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_completed_date TEXT,
  last_generated_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily missions table
CREATE TABLE daily_missions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,
  task TEXT NOT NULL,
  sass TEXT NOT NULL,
  reflection_question TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  reflection_answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One mission per user per day (idempotency guard)
CREATE UNIQUE INDEX idx_daily_missions_user_date ON daily_missions(user_id, date);

-- Fast history queries
CREATE INDEX idx_daily_missions_user_date_desc ON daily_missions(user_id, date DESC);

-- Row-Level Security with permissive policies (API uses service role key)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on users"
  ON users FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Service role full access on daily_missions"
  ON daily_missions FOR ALL USING (TRUE) WITH CHECK (TRUE);
