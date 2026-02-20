import type { User, DailyMission } from "@sassy-coach/shared";

export function mapUserRow(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    authId: (row.auth_id as string) ?? null,
    email: row.email as string | null,
    goal: row.goal as User["goal"],
    tone: row.tone as User["tone"],
    isPremium: row.is_premium as boolean,
    timezone: row.timezone as string,
    streakCount: row.streak_count as number,
    lastCompletedDate: row.last_completed_date as string | null,
    lastGeneratedDate: row.last_generated_date as string | null,
  };
}

export function mapMissionRow(row: Record<string, unknown>): DailyMission {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    date: row.date as string,
    task: row.task as string,
    sass: row.sass as string,
    reflectionQuestion: row.reflection_question as string,
    completed: row.completed as boolean,
    reflectionAnswer: row.reflection_answer as string | null,
    rerollCount: (row.reroll_count as number) ?? 0,
  };
}
