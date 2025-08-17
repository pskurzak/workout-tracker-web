"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionNameState = {
  names: Record<string, string>;
  setName: (sessionId: string, name: string) => void;
  getName: (sessionId: string) => string | undefined;
};

export const useSessionNameStore = create<SessionNameState>()(
  persist(
    (set, get) => ({
      names: {},
      setName: (sessionId, name) =>
        set(s => ({ names: { ...s.names, [sessionId]: name } })),
      getName: (sessionId) => get().names[sessionId],
    }),
    { name: "wt-session-names" }
  )
);