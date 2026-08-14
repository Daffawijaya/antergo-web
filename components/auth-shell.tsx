"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [loading, router, user]);
  if (loading || user) return <LoadingScreen />;
  return <div className="page-shell min-h-screen bg-slate-950">{children}</div>;
}

