export interface Timer {
  id: string;
  name: string;
  description: string;
  elapsed: number; // in seconds
  isRunning: boolean;
  createdAt: number;
  startedAt?: number;
}

export interface TimerState {
  timers: Timer[];
  filter: 'all' | 'running' | 'paused';
  sortBy: 'name' | 'elapsed' | 'createdAt';
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type TimerAction =
  | { type: 'START'; id: string }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESET'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'ADD'; timer: Timer }
  | { type: 'UPDATE'; id: string; updates: Partial<Timer> };
