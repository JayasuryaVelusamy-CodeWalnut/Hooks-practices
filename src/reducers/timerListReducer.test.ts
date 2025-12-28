import { describe, it, expect } from 'vitest';
import { timerListReducer, initialState } from './timerListReducer';
import { Timer } from '../types/timer';

describe('timerListReducer', () => {
  const mockTimer: Timer = {
    id: '1',
    name: 'Test',
    description: 'Test timer',
    elapsed: 0,
    isRunning: false,
    createdAt: Date.now(),
  };

  it('adds timer to the list when ADD_TIMER action is dispatched', () => {
    const state = timerListReducer(initialState, {
      type: 'ADD_TIMER',
      payload: mockTimer,
    });
    expect(state.timers).toHaveLength(1);
    expect(state.timers[0]).toEqual(mockTimer);
  });

  it('updates timer properties when UPDATE_TIMER action is dispatched', () => {
    const state = timerListReducer(
      { ...initialState, timers: [mockTimer] },
      {
        type: 'UPDATE_TIMER',
        payload: { id: '1', updates: { elapsed: 10 } },
      }
    );
    expect(state.timers[0].elapsed).toBe(10);
  });

  it('removes timer from list when DELETE_TIMER action is dispatched', () => {
    const state = timerListReducer(
      { ...initialState, timers: [mockTimer] },
      { type: 'DELETE_TIMER', payload: '1' }
    );
    expect(state.timers).toHaveLength(0);
  });

  it('changes filter type when SET_FILTER action is dispatched', () => {
    const state = timerListReducer(initialState, {
      type: 'SET_FILTER',
      payload: 'running',
    });
    expect(state.filter).toBe('running');
  });

  it('toggles timer selection on and off when TOGGLE_SELECT action is dispatched', () => {
    let state = timerListReducer(
      { ...initialState, timers: [mockTimer] },
      { type: 'TOGGLE_SELECT', payload: '1' }
    );
    expect(state.selectedIds.has('1')).toBe(true);
    state = timerListReducer(state, {
      type: 'TOGGLE_SELECT',
      payload: '1',
    });
    expect(state.selectedIds.has('1')).toBe(false);
  });

  it('replaces all timers when SET_TIMERS action is dispatched', () => {
    const timers = [mockTimer, { ...mockTimer, id: '2' }];
    const state = timerListReducer(initialState, {
      type: 'SET_TIMERS',
      payload: timers,
    });
    expect(state.timers).toEqual(timers);
  });

  it('removes all selected timers when DELETE_SELECTED action is dispatched', () => {
    const timer2 = { ...mockTimer, id: '2' };
    const stateWithSelection = {
      ...initialState,
      timers: [mockTimer, timer2],
      selectedIds: new Set(['1', '2']),
    };
    const state = timerListReducer(stateWithSelection, {
      type: 'DELETE_SELECTED',
    });
    expect(state.timers).toHaveLength(0);
    expect(state.selectedIds.size).toBe(0);
  });

  it('removes deleted timer from selection when DELETE_TIMER action is dispatched', () => {
    const stateWithSelection = {
      ...initialState,
      timers: [mockTimer],
      selectedIds: new Set(['1']),
    };
    const state = timerListReducer(stateWithSelection, {
      type: 'DELETE_TIMER',
      payload: '1',
    });
    expect(state.timers).toHaveLength(0);
    expect(state.selectedIds.has('1')).toBe(false);
  });

  it('changes sort type when SET_SORT action is dispatched', () => {
    const state = timerListReducer(initialState, {
      type: 'SET_SORT',
      payload: 'elapsed',
    });
    expect(state.sortBy).toBe('elapsed');
  });

  it('updates search query when SET_SEARCH action is dispatched', () => {
    const state = timerListReducer(initialState, {
      type: 'SET_SEARCH',
      payload: 'test query',
    });
    expect(state.searchQuery).toBe('test query');
  });

  it('selects all timers when SELECT_ALL action is dispatched', () => {
    const timer2 = { ...mockTimer, id: '2' };
    const state = timerListReducer(
      { ...initialState, timers: [mockTimer, timer2] },
      { type: 'SELECT_ALL' }
    );
    expect(state.selectedIds.size).toBe(2);
    expect(state.selectedIds.has('1')).toBe(true);
    expect(state.selectedIds.has('2')).toBe(true);
  });

  it('clears all selections when CLEAR_SELECTION action is dispatched', () => {
    const stateWithSelection = {
      ...initialState,
      selectedIds: new Set(['1', '2']),
    };
    const state = timerListReducer(stateWithSelection, {
      type: 'CLEAR_SELECTION',
    });
    expect(state.selectedIds.size).toBe(0);
  });
});
