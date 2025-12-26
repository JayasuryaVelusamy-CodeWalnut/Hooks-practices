import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimer } from './useTimer';
import { Timer } from '../types/timer';
import * as timerApiModule from '../api/timerApi';

// Mock only the external API dependency
vi.mock('../api/timerApi', () => ({
  timerApi: {
    updateTimer: vi.fn().mockResolvedValue({}),
  },
}));

const mockTimer: Timer = {
  id: '1',
  name: 'Test Timer',
  description: 'Test',
  elapsed: 0,
  isRunning: false,
  createdAt: Date.now(),
};

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with the provided timer state', () => {
    const { result } = renderHook(() => useTimer(mockTimer));

    expect(result.current.timer.elapsed).toBe(0);
    expect(result.current.timer.isRunning).toBe(false);
  });

  it('starts the timer and updates running state', async () => {
    const { result } = renderHook(() => useTimer(mockTimer));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.timer.isRunning).toBe(true);
    expect(timerApiModule.timerApi.updateTimer).toHaveBeenCalledWith('1', {
      isRunning: true,
    });
  });

  it('pauses the timer and preserves elapsed time', async () => {
    const runningTimer: Timer = {
      ...mockTimer,
      isRunning: true,
      elapsed: 5,
    };

    const { result } = renderHook(() => useTimer(runningTimer));

    await act(async () => {
      await result.current.pause();
    });

    expect(result.current.timer.isRunning).toBe(false);
    expect(result.current.timer.elapsed).toBe(5);
    expect(timerApiModule.timerApi.updateTimer).toHaveBeenCalledWith('1', {
      isRunning: false,
      elapsed: 5,
    });
  });

  it('resets the timer to initial state', async () => {
    const timerWithElapsed: Timer = {
      ...mockTimer,
      elapsed: 10,
      isRunning: true,
    };

    const { result } = renderHook(() => useTimer(timerWithElapsed));

    await act(async () => {
      await result.current.reset();
    });

    expect(result.current.timer.elapsed).toBe(0);
    expect(result.current.timer.isRunning).toBe(false);
    expect(timerApiModule.timerApi.updateTimer).toHaveBeenCalledWith('1', {
      elapsed: 0,
      isRunning: false,
    });
  });

  it('syncs local state when external timer prop changes', () => {
    const { result, rerender } = renderHook(({ timer }) => useTimer(timer), {
      initialProps: { timer: mockTimer },
    });

    expect(result.current.timer.elapsed).toBe(0);

    const updatedTimer = { ...mockTimer, elapsed: 5 };
    rerender({ timer: updatedTimer });

    expect(result.current.timer.elapsed).toBe(5);
  });

  it('does not start the timer if it is already running', async () => {
    const runningTimer: Timer = {
      ...mockTimer,
      isRunning: true,
    };

    const { result } = renderHook(() => useTimer(runningTimer));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.timer.isRunning).toBe(true);
    expect(timerApiModule.timerApi.updateTimer).not.toHaveBeenCalled();
  });

  it('updates local state even if the API call fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(timerApiModule.timerApi.updateTimer).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useTimer(mockTimer));

    await act(async () => {
      await result.current.start();
    });

    // Behavior-first assertion
    expect(result.current.timer.isRunning).toBe(true);

    // Logging is part of error-handling behavior
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update timer:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() => useTimer(mockTimer));
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
