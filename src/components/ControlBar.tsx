import { memo } from 'react';
import { FilterType, SortType } from '../reducers/timerListReducer';

interface ControlBarProps {
  searchQuery: string;
  filter: FilterType;
  sortBy: SortType;
  selectedCount: number;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sortBy: SortType) => void;
  onShowAddForm: () => void;
  onStartAll: () => void;
  onPauseAll: () => void;
  onResetAll: () => void;
  onDeleteSelected: () => void;
  onRefresh: () => void;
  showAddForm: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = memo(
  ({
    searchQuery,
    filter,
    sortBy,
    selectedCount,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onShowAddForm,
    onStartAll,
    onPauseAll,
    onResetAll,
    onDeleteSelected,
    onRefresh,
    showAddForm,
  }) => {
    return (
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search timers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search timers"
            />
          </div>

          <select
            value={filter}
            onChange={e => onFilterChange(e.target.value as FilterType)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter timers by status"
          >
            <option value="all">All Timers</option>
            <option value="running">Running</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as SortType)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort timers"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="elapsed">Sort by Time</option>
          </select>

          {selectedCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              aria-label={`Delete ${selectedCount} selected timers`}
            >
              Delete Selected ({selectedCount})
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onShowAddForm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            aria-label={showAddForm ? 'Cancel adding timer' : 'Add new timer'}
          >
            {showAddForm ? 'Cancel' : 'Add Timer'}
          </button>

          <button
            onClick={onStartAll}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            aria-label="Start all timers"
          >
            Start All
          </button>

          <button
            onClick={onPauseAll}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            aria-label="Pause all timers"
          >
            Pause All
          </button>

          <button
            onClick={onResetAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            aria-label="Reset all timers"
          >
            Reset All
          </button>

          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            aria-label="Refresh timers"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
);

ControlBar.displayName = 'ControlBar';
