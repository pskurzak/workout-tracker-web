"use client";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    if (!token) window.location.href = "/app/login";
  }, [token]);
  if (!token) return null;
  return <>{children}</>;
}