-- Add auth_id column to users (links to Supabase Auth)
ALTER TABLE users ADD COLUMN auth_id UUID UNIQUE;

-- Mission pool: pre-generated missions shared across users
CREATE TABLE mission_pool (
  id SERIAL PRIMARY KEY,
  goal TEXT NOT NULL CHECK (goal IN ('fitness', 'productivity', 'language', 'job-search', 'custom')),
  tone TEXT NOT NULL CHECK (tone IN ('sassy', 'kind', 'drill-sergeant', 'zen')),
  task TEXT NOT NULL,
  sass TEXT NOT NULL,
  reflection_question TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track which pool missions have been served to which users (avoid repeats)
CREATE TABLE user_pool_missions (
  user_id TEXT NOT NULL REFERENCES users(id),
  pool_mission_id INTEGER NOT NULL REFERENCES mission_pool(id),
  served_date TEXT NOT NULL,
  PRIMARY KEY (user_id, pool_mission_id)
);

-- Fast lookup: pool missions for a goal/tone combo
CREATE INDEX idx_mission_pool_goal_tone ON mission_pool(goal, tone);

-- Fast lookup: which pool missions a user has already seen
CREATE INDEX idx_user_pool_missions_user ON user_pool_missions(user_id);

-- RLS policies
ALTER TABLE mission_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pool_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on mission_pool"
  ON mission_pool FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Service role full access on user_pool_missions"
  ON user_pool_missions FOR ALL USING (TRUE) WITH CHECK (TRUE);
