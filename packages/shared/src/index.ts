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
  rerollCount: number;
}

export interface User {
  id: string;
  authId: string | null;
  email: string | null;
  goal: Goal;
  tone: Tone;
  isPremium: boolean;
  timezone: string;
  streakCount: number;
  lastCompletedDate: string | null;
  lastGeneratedDate: string | null;
}

// --- API request/response types ---

export interface GenerateMissionRequest {
  goal: Goal;
  tone: Tone;
}

export interface GenerateMissionResponse {
  mission: DailyMission;
  fromCache: boolean;
}

export interface CompleteMissionRequest {
  missionId: string;
  reflectionAnswer: string | null;
}

export interface CompleteMissionResponse {
  mission: DailyMission;
  streakCount: number;
  lastCompletedDate: string;
}

export interface RegisterUserRequest {
  goal: Goal;
  tone: Tone;
  timezone: string;
}

export interface UpdateUserRequest {
  goal?: Goal;
  tone?: Tone;
  timezone?: string;
  streakCount?: number;
  lastCompletedDate?: string | null;
}

export interface UpdateUserResponse {
  user: User;
}

export interface RegisterUserResponse {
  user: User;
}

export interface GetUserResponse {
  user: User;
}

export interface RerollMissionRequest {
  goal: Goal;
  tone: Tone;
}

export interface RerollMissionResponse {
  mission: DailyMission;
  rerollsRemaining: number;
}

export interface GetHistoryResponse {
  missions: DailyMission[];
}

export interface ResetUserResponse {
  user: User;
}
