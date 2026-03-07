import type { TaskData, TaskResponse, UserResponse } from "./types/types";
import { getRefreshToken, setRefreshToken, clearRefreshToken } from "./auth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function normalizeTask(raw: TaskResponse): TaskData {
  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    description: raw.description,
    state: raw.state,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

let refreshPromise: Promise<boolean> | null = null;

export function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data: UserResponse = await res.json();
    setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

function extractError(json: unknown): string {
  if (Array.isArray(json)) return json.join(", ");
  if (json && typeof json === "object" && "error" in json)
    return String((json as Record<string, unknown>).error);
  return "Request failed";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && !path.includes("/api/v1/refresh")) {
    const refreshed = await tryRefresh();

    if (refreshed) {
      // Retry — the new access token cookie is already set by the browser
      const retryRes = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      const retryText = await retryRes.text();
      const retryJson = retryText ? JSON.parse(retryText) : undefined;

      if (!retryRes.ok) {
        throw new Error(extractError(retryJson));
      }

      return retryJson as T;
    } else {
      clearRefreshToken();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new Error(extractError(json));
  }

  return json as T;
}

export const tasksClient = {
  async getAll(): Promise<TaskData[]> {
    const data = await request<TaskResponse[]>("/api/v1/tasks");
    return data.map(normalizeTask);
  },

  async create(body: {
    title: string;
    author: string;
    description: string;
    state: string;
  }): Promise<TaskData> {
    const data = await request<TaskResponse>("/api/v1/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return normalizeTask(data);
  },

  async update(
    id: number,
    body: Partial<{ title: string; author: string; description: string; state: string }>,
  ): Promise<TaskData> {
    const data = await request<TaskResponse>(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ task: body }),
    });
    return normalizeTask(data);
  },

  delete(id: number): Promise<void> {
    return request<void>(`/api/v1/tasks/${id}`, { method: "DELETE" });
  },
};

export const authClient = {
  async login(email: string, password: string): Promise<UserResponse> {
    const data = await request<UserResponse>("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return data;
  },

  register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void> {
    return request<void>("/api/v1/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  },

  logout(): Promise<void> {
    return request<void>("/api/v1/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    });
  },
};
