import { useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
import { Timer } from '../types/timer';
import { timerApi } from '../api/timerApi';
import { timerCardReducer, type TimerCardState } from '../reducers/timerCardReducer';
import { EditTimerForm } from './EditTimerForm';
import { TimerDisplay } from './TimerDisplay';
import { formatTime } from '../utils/timeFormat';

interface TimerCardProps {
  timer: Timer;
  onUpdate: (timer: Timer) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  onUpdate,
  onDelete,
  isSelected = false,
  onToggleSelect,
}) => {
  const [state, dispatch] = useReducer(timerCardReducer, {
    timer,
    isEditing: false,
    isDeleting: false,
    showConfirm: false,
  } as TimerCardState);

  const intervalRef = useRef<number | null>(null);
  const elapsedRef = useRef(state.timer.elapsed);

  // Sync elapsed ref with state
  useEffect(() => {
    elapsedRef.current = state.timer.elapsed;
  }, [state.timer.elapsed]);

  const formattedTime = useMemo(() => formatTime(state.timer.elapsed), [state.timer.elapsed]);

  const progressInfo = useMemo(() => {
    const percentOfDay = (state.timer.elapsed / 86400) * 100;
    const progressColor =
      percentOfDay > 50 ? 'bg-red-500' : percentOfDay > 25 ? 'bg-yellow-500' : 'bg-green-500';
    return { percent: Math.min(percentOfDay, 100), color: progressColor };
  }, [state.timer.elapsed]);

  useEffect(() => {
    if (state.timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        const newElapsed = elapsedRef.current + 1;
        elapsedRef.current = newElapsed;

        dispatch({
          type: 'UPDATE_TIMER',
          payload: { elapsed: newElapsed },
        });

        if (newElapsed % 5 === 0) {
          timerApi.updateTimer(timer.id, { elapsed: newElapsed });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.timer.isRunning, timer.id]);

  const handleStart = useCallback(() => {
    dispatch({ type: 'UPDATE_TIMER', payload: { isRunning: true } });

    timerApi
      .updateTimer(timer.id, {
        isRunning: true,
        startedAt: Date.now(),
      })
      .then(response => {
        if (response.data) {
          onUpdate(response.data);
        }
      })
      .catch(() => {
        dispatch({ type: 'UPDATE_TIMER', payload: { isRunning: false } });
      });
  }, [timer.id, onUpdate]);

  const handlePause = useCallback(() => {
    dispatch({ type: 'UPDATE_TIMER', payload: { isRunning: false } });

    timerApi
      .updateTimer(timer.id, {
        isRunning: false,
        elapsed: state.timer.elapsed,
      })
      .then(response => {
        if (response.data) {
          onUpdate(response.data);
        }
      })
      .catch(() => {
        dispatch({ type: 'UPDATE_TIMER', payload: { isRunning: true } });
      });
  }, [timer.id, state.timer.elapsed, onUpdate]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'UPDATE_TIMER', payload: { elapsed: 0, isRunning: false } });

    timerApi
      .updateTimer(timer.id, {
        elapsed: 0,
        isRunning: false,
      })
      .then(response => {
        if (response.data) {
          onUpdate(response.data);
        }
      })
      .catch(() => {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: { elapsed: state.timer.elapsed, isRunning: state.timer.isRunning },
        });
      });
  }, [timer.id, state.timer.elapsed, state.timer.isRunning, onUpdate]);

  const handleSave = useCallback(() => {
    timerApi
      .updateTimer(timer.id, {
        name: state.timer.name,
        description: state.timer.description,
      })
      .then(response => {
        if (response.data) {
          dispatch({ type: 'SAVE_EDITS', payload: response.data });
          onUpdate(response.data);
        }
      })
      .catch(() => {
        dispatch({ type: 'CANCEL_EDITING' });
      });
  }, [timer.id, state.timer.name, state.timer.description, onUpdate]);

  const handleDelete = useCallback(() => {
    if (state.showConfirm) {
      dispatch({ type: 'CONFIRM_DELETE' });
      timerApi
        .deleteTimer(timer.id)
        .then(() => {
          onDelete(timer.id);
        })
        .catch(() => {
          dispatch({ type: 'CANCEL_DELETE' });
        });
    } else {
      dispatch({ type: 'SHOW_DELETE_CONFIRM' });
    }
  }, [timer.id, state.showConfirm, onDelete]);

  const handleCancelDelete = useCallback(() => {
    dispatch({ type: 'CANCEL_DELETE' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    dispatch({ type: 'CANCEL_EDITING' });
  }, []);

  const handleStartEdit = useCallback(() => {
    dispatch({ type: 'START_EDITING' });
  }, []);

  const handleNameChange = useCallback((name: string) => {
    dispatch({ type: 'UPDATE_TIMER', payload: { name } });
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    dispatch({ type: 'UPDATE_TIMER', payload: { description } });
  }, []);

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {state.isEditing ? (
        <EditTimerForm
          timer={state.timer}
          onNameChange={handleNameChange}
          onDescriptionChange={handleDescriptionChange}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <TimerDisplay
          timer={state.timer}
          formattedTime={formattedTime}
          progressInfo={progressInfo}
          isSelected={isSelected}
          onToggleSelect={onToggleSelect}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onStartEdit={handleStartEdit}
          onDelete={handleDelete}
          onCancelDelete={handleCancelDelete}
          showConfirm={state.showConfirm}
        />
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Created: {new Date(state.timer.createdAt).toLocaleDateString()}
        </div>
        {state.timer.startedAt && (
          <div className="text-xs text-gray-500">
            Started: {new Date(state.timer.startedAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
