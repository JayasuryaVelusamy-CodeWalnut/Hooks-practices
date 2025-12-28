import { memo } from 'react';
import { Timer } from '../types/timer';

interface TimerControlsProps {
  timer: Timer;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = memo(
  ({ timer, onStart, onPause, onReset }) => {
    return (
      <div className="flex gap-2 mb-3">
        {!timer.isRunning ? (
          <button
            onClick={onStart}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            aria-label="Start timer"
          >
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            aria-label="Pause timer"
          >
            Pause
          </button>
        )}

        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    );
  }
);

TimerControls.displayName = 'TimerControls';
