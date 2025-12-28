import { describe, it, expect } from 'vitest';
import { timerCardReducer, type TimerCardState } from './timerCardReducer';
import { Timer } from '../types/timer';

const mockTimer: Timer = {
  id: '1',
  name: 'Test Timer',
  description: 'Test description',
  elapsed: 0,
  isRunning: false,
  createdAt: Date.now(),
};

const initialState: TimerCardState = {
  timer: mockTimer,
  isEditing: false,
  isDeleting: false,
  showConfirm: false,
};

describe('timerCardReducer', () => {
  it('updates timer properties when UPDATE_TIMER action is dispatched', () => {
    const state = timerCardReducer(initialState, {
      type: 'UPDATE_TIMER',
      payload: { elapsed: 10 },
    });

    expect(state.timer.elapsed).toBe(10);
  });

  it('enables edit mode when START_EDITING action is dispatched', () => {
    const state = timerCardReducer(initialState, {
      type: 'START_EDITING',
    });

    expect(state.isEditing).toBe(true);
  });

  it('disables edit mode when CANCEL_EDITING action is dispatched', () => {
    const editingState = { ...initialState, isEditing: true };
    const state = timerCardReducer(editingState, {
      type: 'CANCEL_EDITING',
    });

    expect(state.isEditing).toBe(false);
  });

  it('updates timer and exits edit mode when SAVE_EDITS action is dispatched', () => {
    const editingState = { ...initialState, isEditing: true };
    const state = timerCardReducer(editingState, {
      type: 'SAVE_EDITS',
      payload: { name: 'Updated Name' },
    });

    expect(state.timer.name).toBe('Updated Name');
    expect(state.isEditing).toBe(false);
  });

  it('shows delete confirmation when SHOW_DELETE_CONFIRM action is dispatched', () => {
    const state = timerCardReducer(initialState, {
      type: 'SHOW_DELETE_CONFIRM',
    });

    expect(state.showConfirm).toBe(true);
  });

  it('hides delete confirmation when CANCEL_DELETE action is dispatched', () => {
    const confirmState = { ...initialState, showConfirm: true };
    const state = timerCardReducer(confirmState, {
      type: 'CANCEL_DELETE',
    });

    expect(state.showConfirm).toBe(false);
  });

  it('sets deleting state when CONFIRM_DELETE action is dispatched', () => {
    const state = timerCardReducer(initialState, {
      type: 'CONFIRM_DELETE',
    });

    expect(state.isDeleting).toBe(true);
  });

  it('preserves previous state when applying multiple partial updates', () => {
    let state = initialState;

    state = timerCardReducer(state, {
      type: 'UPDATE_TIMER',
      payload: { elapsed: 10, isRunning: true },
    });

    expect(state.timer.elapsed).toBe(10);
    expect(state.timer.isRunning).toBe(true);

    state = timerCardReducer(state, {
      type: 'UPDATE_TIMER',
      payload: { name: 'New Name' },
    });

    expect(state.timer.name).toBe('New Name');
    expect(state.timer.elapsed).toBe(10);
  });
});
