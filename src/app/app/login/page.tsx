"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const setToken = useAuthStore(s => s.setToken);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post<{ token: string; user: { id: number; username: string } }>(
        "/auth/login/",
        { username, password }
      );
      setToken(data.token);
      toast.success("Logged in");
      window.location.href = "/app";
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Login failed";
      toast.error(msg);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <input className="border rounded p-2 w-full" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input className="border rounded p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
        <button className="border rounded p-2 w-full" disabled={!username || !password}>Sign in</button>
        <p className="text-sm opacity-70">Don’t have an account? (We can add register later.)</p>
      </form>
    </main>
  );
}