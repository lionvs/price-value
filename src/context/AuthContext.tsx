"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthSession, User } from "@/types";
import { loadSession, saveSession, clearSession, validateCredentials } from "@/lib/auth";
import usersData from "@/data/users.json";

interface AuthContextType {
  user: AuthSession | null;
  isHydrated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isHydrated: false,
  login: () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (session) setUser(session);
    setIsHydrated(true);
  }, []);

  const login = (email: string, password: string) => {
    const found = validateCredentials(email, password, usersData as User[]);
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }
    const session: AuthSession = {
      userId: found.id,
      email: found.email,
      firstName: found.firstName,
      lastName: found.lastName,
      loggedInAt: new Date().toISOString(),
    };
    setUser(session);
    saveSession(session);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
