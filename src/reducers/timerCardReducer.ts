import { Timer } from '../types/timer';

export interface TimerCardState {
  timer: Timer;
  isEditing: boolean;
  isDeleting: boolean;
  showConfirm: boolean;
}

export type TimerCardAction =
  | { type: 'UPDATE_TIMER'; payload: Partial<Timer> }
  | { type: 'START_EDITING' }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_EDITS'; payload: Partial<Timer> }
  | { type: 'SHOW_DELETE_CONFIRM' }
  | { type: 'CANCEL_DELETE' }
  | { type: 'CONFIRM_DELETE' };

export function timerCardReducer(state: TimerCardState, action: TimerCardAction): TimerCardState {
  switch (action.type) {
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: { ...state.timer, ...action.payload },
      };
    case 'START_EDITING':
      return { ...state, isEditing: true };
    case 'CANCEL_EDITING':
      return { ...state, isEditing: false };
    case 'SAVE_EDITS':
      return {
        ...state,
        timer: { ...state.timer, ...action.payload },
        isEditing: false,
      };
    case 'SHOW_DELETE_CONFIRM':
      return { ...state, showConfirm: true };
    case 'CANCEL_DELETE':
      return { ...state, showConfirm: false };
    case 'CONFIRM_DELETE':
      return { ...state, isDeleting: true };
    default: {
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}
