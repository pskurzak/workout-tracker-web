"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { USE_API } from "@/lib/config";
import { MOCK_WORKOUTS } from "@/lib/mock";
import type { Workout } from "@/lib/types";
import { useSessionNameStore } from "@/lib/sessionNames";

export default function DashboardPage() {
  return <DashboardInner />;
}

function DashboardInner() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["workouts", USE_API],
    queryFn: async () => {
      if (!USE_API) return MOCK_WORKOUTS;
      return (await api.get<Workout[]>("/workouts/")).data;
    },
  });

  const getName = useSessionNameStore((s) => s.getName);

  if (isLoading) return <main className="p-6">Loading workouts…</main>;
  if (isError) {
    return (
      <main className="p-6">
        <p className="text-red-600">Failed to load workouts.</p>
        <button className="mt-2 border rounded px-3 py-1" onClick={() => refetch()}>Retry</button>
      </main>
    );
  }

  const sessions = new Map<string, Workout[]>();
  (data ?? []).forEach((w) => {
    const arr = sessions.get(w.session_id) ?? [];
    arr.push(w);
    sessions.set(w.session_id, arr);
  });

  if (!data || data.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Your Workouts</h1>
        <p className="opacity-70 mt-2">
          No workouts yet. (Mock mode is {USE_API ? "off" : "on"}.)
        </p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Your Workouts</h1>
      <div className="mt-4 grid gap-3">
        {Array.from(sessions.entries()).map(([sessionID, entries]) => (
          <Link key={sessionID} href={`/app/workout/${sessionID}`} className="border rounded p-4 hover:bg-black/5">
            <div className="font-medium">
              {useSessionNameStore.getState().getName(sessionID) || `Session ${sessionID.slice(0, 8)}…`}
            </div>
            <div className="text-sm opacity-70">{entries.length} entries</div>
          </Link>
        ))}
      </div>
    </main>
  );
}