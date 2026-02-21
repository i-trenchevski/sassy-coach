import type {
  GenerateMissionRequest,
  GenerateMissionResponse,
  CompleteMissionRequest,
  CompleteMissionResponse,
  RerollMissionRequest,
  RerollMissionResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserResponse,
  GetHistoryResponse,
  ResetUserResponse,
} from "@sassy-coach/shared";
import { supabase } from "@/lib/supabase";

const API_BASE = __DEV__
  ? "http://192.168.2.4:3000" // Local dev — your laptop's WiFi IP
  : "https://sassy-coach-test.up.railway.app";

async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function apiCall<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  register(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    return apiCall("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getUser(): Promise<GetUserResponse> {
    return apiCall("/user");
  },

  updateUser(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    return apiCall("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  generateMission(
    data: GenerateMissionRequest
  ): Promise<GenerateMissionResponse> {
    return apiCall("/generate-mission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  rerollMission(data: RerollMissionRequest): Promise<RerollMissionResponse> {
    return apiCall("/reroll-mission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  completeMission(
    data: CompleteMissionRequest
  ): Promise<CompleteMissionResponse> {
    return apiCall("/complete-mission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHistory(limit = 30): Promise<GetHistoryResponse> {
    return apiCall(`/history?limit=${limit}`);
  },

  resetUser(): Promise<ResetUserResponse> {
    return apiCall("/user/reset", { method: "POST" });
  },
};
