"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const setAuth = useAuthStore((s) => s.setToken);

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">Paste API Token</h1>
        <p className="text-sm opacity-70 mt-1">
          Temporary: paste your DRF token to try the web app. We’ll add username/password next.
        </p>
        <input
          className="mt-4 w-full border rounded p-2"
          placeholder="Token …"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          className="mt-3 w-full border rounded p-2 hover:bg-black/5"
          onClick={() => {
            if (!token.trim()) return toast.error("Token required");
            setAuth(token.trim());
            toast.success("Token saved");
            window.location.href = "/app";
          }}
        >
          Continue
        </button>
      </div>
    </main>
  );
}