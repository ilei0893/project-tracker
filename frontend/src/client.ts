import type { TaskData, TaskResponse } from "./types/types";

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }

  return json as T;
}

export const tasksClient = {
  async getAll(): Promise<TaskData[]> {
    const data = await request<TaskResponse[]>("/tasks");
    return data.map(normalizeTask);
  },

  async create(body: {
    title: string;
    author: string;
    description: string;
    state: string;
  }): Promise<TaskData> {
    const data = await request<TaskResponse>("/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return normalizeTask(data);
  },

  async update(id: number, body: { state: string }): Promise<TaskData> {
    const data = await request<TaskResponse>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ task: body }),
    });
    return normalizeTask(data);
  },

  delete(id: number): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: "DELETE" });
  },
};

export const authClient = {
  login(email: string, password: string): Promise<{ token: string }> {
    return request<{ token: string }>("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register(
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void> {
    return request<void>("/api/v1/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  },
};
