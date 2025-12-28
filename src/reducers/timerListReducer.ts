import { Timer } from '../types/timer';

export type FilterType = 'all' | 'running' | 'paused';
export type SortType = 'createdAt' | 'elapsed' | 'name';

export interface TimerListState {
  timers: Timer[];
  filter: FilterType;
  sortBy: SortType;
  searchQuery: string;
  selectedIds: Set<string>;
}

export type TimerListAction =
  | { type: 'SET_TIMERS'; payload: Timer[] }
  | { type: 'ADD_TIMER'; payload: Timer }
  | { type: 'UPDATE_TIMER'; payload: { id: string; updates: Partial<Timer> } }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'DELETE_SELECTED' }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SORT'; payload: SortType }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'TOGGLE_SELECT'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'CLEAR_SELECTION' };

export const initialState: TimerListState = {
  timers: [],
  filter: 'all',
  sortBy: 'createdAt',
  searchQuery: '',
  selectedIds: new Set(),
};

export function timerListReducer(state: TimerListState, action: TimerListAction): TimerListState {
  switch (action.type) {
    case 'SET_TIMERS':
      return { ...state, timers: action.payload };

    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? { ...timer, ...action.payload.updates } : timer
        ),
      };

    case 'DELETE_TIMER':
      return {
        ...state,
        timers: state.timers.filter(timer => timer.id !== action.payload),
        selectedIds: new Set(Array.from(state.selectedIds).filter(id => id !== action.payload)),
      };

    case 'DELETE_SELECTED':
      return {
        ...state,
        timers: state.timers.filter(timer => !state.selectedIds.has(timer.id)),
        selectedIds: new Set(),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'SET_SORT':
      return { ...state, sortBy: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'TOGGLE_SELECT': {
      const newSelectedIds = new Set(state.selectedIds);
      if (newSelectedIds.has(action.payload)) {
        newSelectedIds.delete(action.payload);
      } else {
        newSelectedIds.add(action.payload);
      }
      return { ...state, selectedIds: newSelectedIds };
    }

    case 'SELECT_ALL':
      return {
        ...state,
        selectedIds: new Set(state.timers.map(t => t.id)),
      };

    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: new Set() };

    default: {
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}
