"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@/types";
import { ApiError } from "@/lib/api/client";

interface Credentials {
  email: string;
  password: string;
}

interface Registration extends Credentials {
  name: string;
  phone: string;
  password_confirmation: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (data: Registration) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function sessionRequest(path: string, body?: unknown): Promise<{ user?: User; message?: string; errors?: Record<string, string[]> }> {
  const response = await fetch(`/api/session/${path}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) throw new ApiError(payload.message ?? "Autentikasi gagal.", response.status, payload.errors);
  return payload;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetch("/api/backend/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((payload) => { if (!payload.user?.roles?.includes("admin")) throw new Error(); if (active) setUser(payload.user); })
      .catch(() => { if (active) { setUser(null); void fetch("/api/session/logout", { method: "POST" }); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const unauthorized = () => {
      setUser(null);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    };
    window.addEventListener("antergo:unauthorized", unauthorized);
    return () => window.removeEventListener("antergo:unauthorized", unauthorized);
  }, [pathname, router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (credentials) => {
      const payload = await sessionRequest("login", credentials);
      setUser(payload.user ?? null);
    },
    register: async (data) => {
      const payload = await sessionRequest("register", data);
      setUser(payload.user ?? null);
    },
    logout: async () => {
      await sessionRequest("logout");
      setUser(null);
      router.replace("/login");
    },
  }), [loading, router, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}


