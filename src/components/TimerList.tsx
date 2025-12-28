import { useReducer, useMemo, useCallback, useEffect, useState } from 'react';
import { Timer } from '../types/timer';
import { timerApi } from '../api/timerApi';
import { TimerCard } from './TimerCard';
import { StatsPanel } from './StatsPanel';
import { ControlBar } from './ControlBar';
import { AddTimerForm } from './AddTimerForm';
import {
  timerListReducer,
  initialState,
  type FilterType,
  type SortType,
} from '../reducers/timerListReducer';

// ✅ FIXED: Using useReducer to manage complex state
// ✅ FIXED: Using useMemo for derived values
// ✅ FIXED: Using useCallback for event handlers
// Note: Still has some anti-patterns intentionally (no custom hooks, large component)

export const TimerList: React.FC = () => {
  // ✅ FIXED: Replaced 12+ useState with single useReducer
  const [state, dispatch] = useReducer(timerListReducer, initialState);

  // Loading and error states kept separate (will move to custom hook in Phase 4)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ✅ FIXED: Derived values now use useMemo
  const totalElapsed = useMemo(
    () => state.timers.reduce((sum, timer) => sum + timer.elapsed, 0),
    [state.timers]
  );

  const runningCount = useMemo(() => state.timers.filter(t => t.isRunning).length, [state.timers]);

  const pausedCount = useMemo(() => state.timers.filter(t => !t.isRunning).length, [state.timers]);

  // ✅ FIXED: API call wrapped in useCallback
  const loadTimers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await timerApi.getAllTimers();
      if (response.error) {
        setError(response.error);
      } else {
        dispatch({ type: 'SET_TIMERS', payload: response.data });
      }
    } catch {
      setError('Failed to load timers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimers();
  }, [loadTimers]);

  // ✅ FIXED: Filter and sort logic now uses useMemo
  const filteredTimers = useMemo(() => {
    let filtered = [...state.timers];

    // Apply status filter
    if (state.filter === 'running') {
      filtered = filtered.filter(t => t.isRunning);
    } else if (state.filter === 'paused') {
      filtered = filtered.filter(t => !t.isRunning);
    }

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (state.sortBy === 'elapsed') {
        return b.elapsed - a.elapsed;
      } else {
        return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [state.timers, state.filter, state.searchQuery, state.sortBy]);

  // ✅ FIXED: Event handlers wrapped in useCallback
  const handleTimerUpdate = useCallback((updatedTimer: Timer) => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: { id: updatedTimer.id, updates: updatedTimer },
    });
  }, []);

  const handleTimerDelete = useCallback(async (id: string) => {
    try {
      await timerApi.deleteTimer(id);
      dispatch({ type: 'DELETE_TIMER', payload: id });
    } catch {
      setError('Failed to delete timer');
    }
  }, []);

  const handleCreateTimer = useCallback(async (name: string, description: string) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await timerApi.createTimer({
        name,
        description,
        elapsed: 0,
        isRunning: false,
        createdAt: Date.now(),
      });

      if (response.error) {
        setError(response.error);
      } else {
        dispatch({ type: 'ADD_TIMER', payload: response.data });
        setShowAddForm(false);
      }
    } catch {
      setError('Failed to create timer');
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleStartAll = useCallback(() => {
    state.timers.forEach(timer => {
      if (!timer.isRunning) {
        timerApi
          .updateTimer(timer.id, { isRunning: true, startedAt: Date.now() })
          .then(response => {
            if (response.data) {
              dispatch({
                type: 'UPDATE_TIMER',
                payload: { id: response.data.id, updates: response.data },
              });
            }
          })
          .catch(() => {
            setError('Failed to start some timers');
          });
      }
    });
  }, [state.timers]);

  const handlePauseAll = useCallback(() => {
    state.timers.forEach(timer => {
      if (timer.isRunning) {
        timerApi
          .updateTimer(timer.id, { isRunning: false })
          .then(response => {
            if (response.data) {
              dispatch({
                type: 'UPDATE_TIMER',
                payload: { id: response.data.id, updates: response.data },
              });
            }
          })
          .catch(() => {
            setError('Failed to pause some timers');
          });
      }
    });
  }, [state.timers]);

  const handleResetAll = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all timers?')) {
      state.timers.forEach(timer => {
        timerApi
          .updateTimer(timer.id, { elapsed: 0, isRunning: false })
          .then(response => {
            if (response.data) {
              dispatch({
                type: 'UPDATE_TIMER',
                payload: { id: response.data.id, updates: response.data },
              });
            }
          })
          .catch(() => {
            setError('Failed to reset some timers');
          });
      });
    }
  }, [state.timers]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const handleSortChange = useCallback((sortBy: SortType) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (!window.confirm(`Are you sure you want to delete ${state.selectedIds.size} timer(s)?`)) {
      return;
    }

    const idsToDelete = Array.from(state.selectedIds);
    try {
      await Promise.all(idsToDelete.map(id => timerApi.deleteTimer(id)));
      dispatch({ type: 'DELETE_SELECTED' });
    } catch {
      setError('Failed to delete selected timers');
    }
  }, [state.selectedIds]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading timers...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Timer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage and track your timers</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <StatsPanel
        totalTimers={state.timers.length}
        runningCount={runningCount}
        pausedCount={pausedCount}
        totalElapsed={totalElapsed}
      />

      <ControlBar
        searchQuery={state.searchQuery}
        filter={state.filter}
        sortBy={state.sortBy}
        selectedCount={state.selectedIds.size}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onShowAddForm={() => setShowAddForm(!showAddForm)}
        onStartAll={handleStartAll}
        onPauseAll={handlePauseAll}
        onResetAll={handleResetAll}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={loadTimers}
        showAddForm={showAddForm}
      />

      {showAddForm && <AddTimerForm onSubmit={handleCreateTimer} isCreating={isCreating} />}

      {filteredTimers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No timers found</p>
          <p className="text-gray-400 text-sm mt-2">
            {state.searchQuery || state.filter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first timer to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTimers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onUpdate={handleTimerUpdate}
              onDelete={handleTimerDelete}
              isSelected={state.selectedIds.has(timer.id)}
              onToggleSelect={() =>
                dispatch({
                  type: 'TOGGLE_SELECT',
                  payload: timer.id,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
