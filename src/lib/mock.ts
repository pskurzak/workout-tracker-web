import type { Workout, Exercise } from "./types";

export const MOCK_EXERCISES: Exercise[] = [
  { id: 3,  name: "Barbell Bench Press", muscle_group: "Chest", equipment: "Barbell" },
  { id: 5,  name: "Deadlift",            muscle_group: "Back",  equipment: "Barbell" },
  { id: 11, name: "Lateral Raise",       muscle_group: "Shoulders", equipment: "Dumbbells" },
];

export const MOCK_WORKOUTS: Workout[] = [
  { id: 1, date: "2025-08-15T14:03:00Z", sets: 5, reps: 8,  weight: "185.00", session_id: "abc12345-1111", exercise: 3,  user: 1, notes: "Felt strong" },
  { id: 2, date: "2025-08-15T14:04:20Z", sets: 3, reps: 12, weight: "45.00",  session_id: "abc12345-1111", exercise: 11, user: 1 },
  { id: 3, date: "2025-08-16T15:10:00Z", sets: 5, reps: 5,  weight: "200.00", session_id: "def67890-2222", exercise: 5,  user: 1 },
];

export function getSessionEntries(sessionId: string): Workout[] {
  return MOCK_WORKOUTS.filter(w => w.session_id === sessionId);
}

export function exerciseName(id: number): string {
  return MOCK_EXERCISES.find(e => e.id === id)?.name ?? `Exercise #${id}`;
}