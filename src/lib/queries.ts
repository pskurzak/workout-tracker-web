import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Workout } from "./types";

export function useSessionEntries(sessionId: string, live: boolean) {
  return useQuery({
    queryKey: ["session", sessionId, "entries", live],
    enabled: !!sessionId,
    queryFn: async () => {
      const { data } = await api.get<Workout[]>(`/workouts/`, { params: { session_id: sessionId } });
      return data;
    }
  });
}

export function useAddEntry(sessionId: string, onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { exercise_id: number; sets: number; reps: number; weight?: number | string | null; notes?: string }) => {
      const { data } = await api.post<Workout>("/workouts/", { ...payload, session_id: sessionId });
      return data;
    },
    onSuccess: (created) => {
      qc.setQueryData<Workout[]>(["session", sessionId, "entries", true], (prev = []) => [created, ...prev]);
      onDone?.();
    }
  });
}

export function useDeleteEntry(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/workouts/${id}/`);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<Workout[]>(["session", sessionId, "entries", true], (prev = []) => prev.filter(e => e.id !== id));
    }
  });
}