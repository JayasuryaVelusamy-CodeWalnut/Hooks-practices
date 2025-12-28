import { memo } from 'react';
import { Timer } from '../types/timer';
import { TimerControls } from './TimerControls';
import { TimerActions } from './TimerActions';

interface TimerDisplayProps {
  timer: Timer;
  formattedTime: string;
  progressInfo: { percent: number; color: string };
  isSelected: boolean;
  onToggleSelect?: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
  showConfirm: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = memo(
  ({
    timer,
    formattedTime,
    progressInfo,
    isSelected,
    onToggleSelect,
    onStart,
    onPause,
    onReset,
    onStartEdit,
    onDelete,
    onCancelDelete,
    showConfirm,
  }) => {
    return (
      <>
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">{timer.name}</h3>
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                aria-label={`Select timer ${timer.name}`}
              />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{timer.description}</p>
        </div>

        <div className="mb-4">
          <div
            className="text-4xl font-mono font-bold text-center text-gray-900"
            aria-live="polite"
            aria-atomic="true"
          >
            {formattedTime}
          </div>
          <div
            className="mt-2 bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={progressInfo.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`${progressInfo.color} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progressInfo.percent}%` }}
            />
          </div>
        </div>

        <TimerControls timer={timer} onStart={onStart} onPause={onPause} onReset={onReset} />

        <TimerActions
          onStartEdit={onStartEdit}
          onDelete={onDelete}
          onCancelDelete={onCancelDelete}
          showConfirm={showConfirm}
        />
      </>
    );
  }
);

TimerDisplay.displayName = 'TimerDisplay';
