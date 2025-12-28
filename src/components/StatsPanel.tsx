import { memo } from 'react';
import { formatTime } from '../utils/timeFormat';

interface StatsPanelProps {
  totalTimers: number;
  runningCount: number;
  pausedCount: number;
  totalElapsed: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = memo(
  ({ totalTimers, runningCount, pausedCount, totalElapsed }) => {
    return (
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Timers</div>
          <div className="text-2xl font-bold text-blue-900">{totalTimers}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Running</div>
          <div className="text-2xl font-bold text-green-900">{runningCount}</div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">Paused</div>
          <div className="text-2xl font-bold text-yellow-900">{pausedCount}</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Total Time</div>
          <div className="text-2xl font-bold text-purple-900">{formatTime(totalElapsed)}</div>
        </div>
      </div>
    );
  }
);

StatsPanel.displayName = 'StatsPanel';
