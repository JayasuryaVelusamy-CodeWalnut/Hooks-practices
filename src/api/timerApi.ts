import { Timer, ApiResponse } from '../types/timer';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated database
let mockTimers: Timer[] = [
  {
    id: '1',
    name: 'Project Work',
    description: 'Working on React project',
    elapsed: 3600,
    isRunning: false,
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    name: 'Meeting',
    description: 'Team standup meeting',
    elapsed: 1800,
    isRunning: false,
    createdAt: Date.now() - 43200000,
  },
  {
    id: '3',
    name: 'Learning',
    description: 'React Hooks practice',
    elapsed: 0,
    isRunning: false,
    createdAt: Date.now(),
  },
];

export const timerApi = {
  async getAllTimers(): Promise<ApiResponse<Timer[]>> {
    await delay(500);
    return { data: [...mockTimers] };
  },

  async getTimer(id: string): Promise<ApiResponse<Timer>> {
    await delay(300);
    const timer = mockTimers.find(t => t.id === id);
    if (!timer) {
      return { data: {} as Timer, error: 'Timer not found' };
    }
    return { data: { ...timer } };
  },

  async createTimer(timer: Omit<Timer, 'id'>): Promise<ApiResponse<Timer>> {
    await delay(400);
    const newTimer: Timer = {
      ...timer,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockTimers.push(newTimer);
    return { data: newTimer };
  },

  async updateTimer(id: string, updates: Partial<Timer>): Promise<ApiResponse<Timer>> {
    await delay(300);
    const index = mockTimers.findIndex(t => t.id === id);
    if (index === -1) {
      return { data: {} as Timer, error: 'Timer not found' };
    }
    mockTimers[index] = { ...mockTimers[index], ...updates };
    return { data: mockTimers[index] };
  },

  async deleteTimer(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    mockTimers = mockTimers.filter(t => t.id !== id);
    return { data: undefined };
  },
};
