import { useState, useRef, useCallback, useEffect } from 'react';
import { Timer } from '../types/timer';
import { timerApi } from '../api/timerApi';

export function useTimer(initialTimer: Timer) {
  const [timer, setTimer] = useState<Timer>(initialTimer);
  const intervalRef = useRef<number | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (timer.isRunning) return;

    setTimer(prev => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      setTimer(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
    }, 1000);

    try {
      await timerApi.updateTimer(timer.id, { isRunning: true });
    } catch (error) {
      console.error('Failed to update timer:', error);
    }
  }, [timer.id, timer.isRunning]);

  const pause = useCallback(async () => {
    clearTimerInterval();

    let latestElapsed = 0;

    setTimer(prev => {
      latestElapsed = prev.elapsed;
      return { ...prev, isRunning: false };
    });

    try {
      await timerApi.updateTimer(timer.id, {
        isRunning: false,
        elapsed: latestElapsed,
      });
    } catch (error) {
      console.error('Failed to pause timer:', error);
    }
  }, [timer.id, clearTimerInterval]);

  const reset = useCallback(async () => {
    clearTimerInterval();

    setTimer(prev => ({ ...prev, elapsed: 0, isRunning: false }));

    try {
      await timerApi.updateTimer(timer.id, {
        elapsed: 0,
        isRunning: false,
      });
    } catch (error) {
      console.error('Failed to reset timer:', error);
    }
  }, [timer.id, clearTimerInterval]);

  useEffect(() => {
    return clearTimerInterval;
  }, [clearTimerInterval]);

  useEffect(() => {
    setTimer(initialTimer);
  }, [initialTimer]);

  return { timer, start, pause, reset };
}
