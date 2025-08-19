"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionEntries, exerciseName } from "@/lib/mock";
import type { Workout } from "@/lib/types";
import { useSessionNameStore } from "@/lib/sessionNames";
import { USE_API } from "@/lib/config";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSessionEntries, useAddEntry, useDeleteEntry } from "@/lib/queries";

export default function SessionPage() {
  const params = useParams<{ sessionID: string }>();
  const sessionID = (params?.sessionID as string) ?? "";
  const qc = useQueryClient();

  // Entries: call both hooks but enable only the active one to satisfy hook rules
  const liveEntries = useSessionEntries(sessionID, !!USE_API);
  const mockEntries = useQuery({
    queryKey: ["session", sessionID, "entries", "mock"],
    queryFn: async () => {
      if (!sessionID) return [] as Workout[];
      return getSessionEntries(sessionID);
    },
    enabled: !!sessionID && !USE_API,
  });
  const entries: Workout[] = (USE_API ? liveEntries.data : mockEntries.data) ?? [];

  // Session name with server-backed rename
  const storedName = useSessionNameStore((s) => s.getName(sessionID));
  const setName = useSessionNameStore((s) => s.setName);
  const [editingName, setEditingName] = useState(storedName ?? "");

  const defaultTitle = useMemo(() => `Session ${sessionID.slice(0, 8)}…`, [sessionID]);
  const title = storedName?.trim() ? storedName : defaultTitle;

  const renameMutation = useMutation({
    mutationFn: async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Name required");
      if (USE_API) {
        await api.patch(`/sessions/${sessionID}/name`, { name: trimmed });
      }
      return trimmed;
    },
    onSuccess: (newName) => {
      setName(sessionID, newName);
      toast.success("Session renamed");
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to rename";
      toast.error(msg);
    },
  });

  // Add entry (mock; optimistic)
  const [newEntry, setNewEntry] = useState({ exercise: 3, sets: 3, reps: 10, weight: "" });

  // Live hooks for add/delete when API is enabled
  const addLive = useAddEntry(sessionID, () => setNewEntry({ exercise: 3, sets: 3, reps: 10, weight: "" }));
  const delLive = useDeleteEntry(sessionID);

  const addMutation = useMutation({
    mutationFn: async (payload: { exercise: number; sets: number; reps: number; weight: string }) => {
      const now = new Date().toISOString();
      const faux: Workout = {
        id: Math.floor(Math.random() * 1e6),
        date: now,
        sets: payload.sets,
        reps: payload.reps,
        weight: payload.weight || null,
        session_id: sessionID,
        exercise: payload.exercise,
        user: 1,
      };
      // Live mode will POST to /workouts/
      return faux;
    },
    onSuccess: (created) => {
      qc.setQueryData<Workout[]>(["session", sessionID, "entries", USE_API], (prev = []) => [created, ...prev]);
    },
  });

  // Delete entry (mock)
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: (id) => {
      qc.setQueryData<Workout[]>(["session", sessionID, "entries", USE_API], (prev = []) => prev.filter(e => e.id !== id));
    },
  });

  function onAdd() {
    if (USE_API) {
      addLive.mutate({
        exercise_id: newEntry.exercise,
        sets: newEntry.sets,
        reps: newEntry.reps,
        weight: newEntry.weight ? Number(newEntry.weight) : null,
      });
    } else {
      addMutation.mutate(newEntry);
    }
  }

  function onDelete(id: number) {
    if (USE_API) {
      delLive.mutate(id);
    } else {
      deleteMutation.mutate(id);
    }
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm opacity-70">{entries.length} entr{entries.length === 1 ? "y" : "ies"}</p>
        </div>
        <Link href="/app" className="text-sm underline">← Back to dashboard</Link>
      </div>

      {/* Rename session */}
      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Rename session</h2>
        <div className="flex gap-2">
          <input
            className="border rounded p-2 w-full"
            placeholder={defaultTitle}
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
          <button
            className="border rounded px-3 py-2 disabled:opacity-50"
            onClick={() => renameMutation.mutate(editingName)}
            disabled={!editingName.trim() || renameMutation.isPending}
          >
            {renameMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </section>

      {/* Add entry */}
      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Add entry</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <select
            className="border rounded p-2"
            value={newEntry.exercise}
            onChange={(e) => setNewEntry(s => ({ ...s, exercise: Number(e.target.value) }))}
          >
            <option value={3}>Barbell Bench Press</option>
            <option value={5}>Deadlift</option>
            <option value={11}>Lateral Raise</option>
          </select>
          <input
            className="border rounded p-2"
            type="number"
            min={1}
            value={newEntry.sets}
            onChange={(e) => setNewEntry(s => ({ ...s, sets: Number(e.target.value) }))}
            placeholder="Sets"
          />
          <input
            className="border rounded p-2"
            type="number"
            min={1}
            value={newEntry.reps}
            onChange={(e) => setNewEntry(s => ({ ...s, reps: Number(e.target.value) }))}
            placeholder="Reps"
          />
          <input
            className="border rounded p-2"
            type="number"
            step="0.5"
            value={newEntry.weight}
            onChange={(e) => setNewEntry(s => ({ ...s, weight: e.target.value }))}
            placeholder="Weight"
          />
        </div>
        <button
          className="border rounded px-3 py-2 mt-2"
          onClick={onAdd}
        >
          Add entry
        </button>
      </section>

      {/* Entries list */}
      <section className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Exercise</th>
              <th className="p-3">Sets</th>
              <th className="p-3">Reps</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="p-3">{exerciseName(e.exercise)}</td>
                <td className="p-3">{e.sets}</td>
                <td className="p-3">{e.reps}</td>
                <td className="p-3">{e.weight ?? "-"}</td>
                <td className="p-3">{new Date(e.date).toLocaleString()}</td>
                <td className="p-3">
                  <button
                    className="border rounded px-2 py-1"
                    onClick={() => onDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td className="p-3 opacity-70" colSpan={6}>No entries for this session yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}