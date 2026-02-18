import type {
  GenerateMissionRequest,
  GenerateMissionResponse,
  CompleteMissionRequest,
  CompleteMissionResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  GetUserResponse,
  GetHistoryResponse,
} from "@sassy-coach/shared";

// TODO: Update this to your deployed API URL for production
const API_BASE = __DEV__
  ? "http://192.168.2.4:3000" // Local dev — your laptop's WiFi IP
  : "https://your-api.com";

async function apiCall<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
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

  getUser(userId: string): Promise<GetUserResponse> {
    return apiCall(`/user/${userId}`);
  },

  generateMission(
    data: GenerateMissionRequest
  ): Promise<GenerateMissionResponse> {
    return apiCall("/generate-mission", {
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

  getHistory(userId: string, limit = 30): Promise<GetHistoryResponse> {
    return apiCall(`/history/${userId}?limit=${limit}`);
  },
};
