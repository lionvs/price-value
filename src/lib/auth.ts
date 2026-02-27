import { AuthSession, User } from "@/types";

const AUTH_KEY = "pv-auth";

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(AUTH_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function validateCredentials(
  email: string,
  password: string,
  users: User[]
): User | null {
  return (
    users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) ?? null
  );
}
