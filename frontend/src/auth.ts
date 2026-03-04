import type { UserData } from "./types/types";

export function getStoredUser(): UserData | null {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: UserData): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem("user");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function setRefreshToken(token: string): void {
  localStorage.setItem("refresh_token", token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem("refresh_token");
  clearStoredUser();
}
