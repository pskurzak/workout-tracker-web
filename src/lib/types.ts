export type Workout = {
  id: number;
  date: string;              // ISO string
  sets: number;
  reps: number;
  weight: string | number | null;
  session_id: string;
  exercise: number;          // exercise id
  user: number;
  notes?: string;
};

export type Exercise = {
  id: number;
  name: string;
  muscle_group?: string | null;
  equipment?: string | null;
};