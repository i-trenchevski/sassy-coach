export type Goal =
  | "fitness"
  | "productivity"
  | "language"
  | "job-search"
  | "custom";

export type Tone = "sassy" | "kind" | "drill-sergeant" | "zen";

export interface DailyMission {
  id: string;
  userId: string;
  date: string;
  task: string;
  sass: string;
  reflectionQuestion: string;
  completed: boolean;
  reflectionAnswer: string | null;
}

export interface User {
  id: string;
  email: string | null;
  goal: Goal;
  tone: Tone;
  isPremium: boolean;
  timezone: string;
  streakCount: number;
  lastCompletedDate: string | null;
  lastGeneratedDate: string | null;
}
