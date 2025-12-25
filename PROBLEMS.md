# Documented Problems & Anti-Patterns

This file catalogs all intentional React Hooks anti-patterns in the codebase, organized by component and problem type.

## 📊 Problem Summary

| Component | Lines of Code | Problems Count |
|-----------|--------------|----------------|
| TimerCard.tsx | 320+ | 15+ issues |
| TimerList.tsx | 400+ | 18+ issues |
| SummaryWidget.tsx | 280+ | 12+ issues |
| App.tsx | 80+ | 3 issues |

---

## 🔴 TimerCard.tsx Problems

### State Management
- **Line ~15-23**: Excessive `useState` - 8 separate state variables
  - `intervalId` stored in state (should use `useRef`)
  - `elapsed`, `isRunning` duplicates props
  - Multiple UI states that could be combined
  
### Side Effects
- **Line ~35-42**: Missing `useEffect` dependencies
  - `timer.id` not in dependency array
  - No cleanup function
  
- **Line ~45-60**: Timer interval with critical issues
  - ❌ Interval ID stored in state causes re-renders
  - ❌ No cleanup function returned
  - ❌ Missing dependencies: `intervalId`, `elapsed`, `timer.id`
  - ❌ API call on every tick (performance nightmare)

### Performance
- **Line ~27-30**: Expensive calculations on every render
  - `hours`, `minutes`, `seconds` recalculated
  - `formattedTime` rebuilt each render
  - Should use `useMemo`
  
- **Line ~32-33**: Progress calculations without memoization
  - `percentOfDay` recalculated unnecessarily
  - `progressColor` recalculated unnecessarily

### Callbacks
- **Line ~63-75**: `handleStart` - inline callback, not memoized
- **Line ~78-89**: `handlePause` - inline callback, not memoized
- **Line ~92-106**: `handleReset` - inline callback, not memoized
- **Line ~109-125**: `handleSave` - inline callback, async not handled properly
- **Line ~128-140**: `handleDelete` - inline callback, not memoized
- **Line ~143-148**: `handleCancel` - inline callback, not memoized

### Code Organization
- **Line ~151-184**: `renderEditMode` - complex logic in render helper
- **Line ~187-240**: `renderViewMode` - complex logic in render helper
- **Total**: 300+ lines in single component (too large)

---

## 🔴 TimerList.tsx Problems

### State Management
- **Line ~17-26**: Excessive `useState` - should use `useReducer`
  - 10 separate state variables for related data
  - `timers`, `filteredTimers` - derived state stored separately
  - Complex state transitions not centralized

### Derived Values
- **Line ~29-32**: Expensive calculations without `useMemo`
  - `totalElapsed` - array reduce on every render
  - `runningCount` - array filter on every render
  - `pausedCount` - array filter on every render
  - `averageElapsed` - calculation on every render

### Utility Functions
- **Line ~35-40**: `formatTime` duplicated from TimerCard
  - Should be in shared utility or custom hook
  - Same logic in 3 different components

### Side Effects
- **Line ~43-45**: `useEffect` with missing dependencies
  - `loadTimers` not in dependency array
  - Should use `useCallback` for `loadTimers`
  
- **Line ~48-59**: Async function not memoized
  - `loadTimers` recreated on every render
  - Not wrapped in `useCallback`
  
- **Line ~62-82**: Filter logic in `useEffect` - should use `useMemo`
  - Entire filtering/sorting runs in effect
  - Creates derived state instead of computing on-demand
  - Sets `filteredTimers` state unnecessarily

### Callbacks
- **Line ~85-89**: `handleTimerUpdate` - inline, not memoized
- **Line ~92-94**: `handleTimerDelete` - inline, not memoized
- **Line ~97-121**: `handleCreateTimer` - inline, async errors not handled
- **Line ~124-135**: `handleStartAll` - multiple API calls in loop
- **Line ~138-148**: `handlePauseAll` - multiple API calls in loop
- **Line ~151-161**: `handleResetAll` - multiple API calls in loop

### Rendering
- **Line ~164-184**: `renderStats` - complex rendering logic
- **Line ~187-238**: `renderControls` - complex rendering logic
- **Line ~241-275**: `renderAddForm` - complex rendering logic

### Performance Issues
- No `React.memo` on child components
- Inline callbacks passed to `TimerCard` cause unnecessary re-renders
- Filter/sort runs in effect instead of `useMemo`

---

## 🔴 SummaryWidget.tsx Problems

### State Management
- **Line ~16-21**: Excessive `useState`
  - `refreshInterval` stored in state (should use `useRef`)
  - Duplicated timer state management

### Duplicated Logic
- **Line ~24-29**: `formatTime` duplicated (3rd time!)
  - Exact same function in TimerCard and TimerList
  - Should be custom hook or utility

### Performance Bottlenecks
- **Line ~32-56**: MASSIVE expensive calculations without `useMemo`
  - `totalTimers` - simple but recalculated
  - `runningTimers` - array filter
  - `pausedTimers` - array filter
  - `totalElapsed` - array reduce
  - `averageElapsed` - calculation
  - `longestTimer` - array reduce
  - `shortestTimer` - array reduce
  - `todayTimers` - array filter with date calculations
  - `thisWeekTimers` - array filter with date calculations
  - `totalRunningTime` - array reduce
  - `totalPausedTime` - array reduce
  - `productivityScore` - calculation
  - `completionRate` - calculation
  
  **ALL recalculated on EVERY render!**

### Side Effects
- **Line ~58-63**: Missing dependencies in `useEffect`
  - `propTimers` dependency issue
  - `loadTimers` not in dependencies
  
- **Line ~66-78**: Auto-refresh interval issues
  - Interval ID stored in state
  - No cleanup function returned
  - Missing dependencies: `refreshInterval`, `loadTimers`

### Callbacks
- **Line ~81-95**: `loadTimers` - inline async function
- **Line ~98-100**: `handleRefresh` - inline callback
- **Line ~103-105**: `toggleAutoRefresh` - inline callback

### Code Organization
- 280+ lines in single component
- Business logic mixed with rendering
- Should be split into smaller components

---

## 🔴 App.tsx Problems

### Context
- **Missing**: No `ThemeContext` for dark mode
  - Dark mode state should use Context API
  - Props drilling could occur with more components

### Callbacks
- **Line ~14-21**: Inline callbacks for navigation
  - Not memoized with `useCallback`

### State
- **Line ~12**: `darkMode` state could be in context
- **Line ~11**: `view` state could be in URL (routing)

---

## 📋 Cross-Cutting Concerns

### Missing Custom Hooks
1. **useTimer**
   - Should manage timer state (start, pause, reset, elapsed)
   - Should handle interval cleanup
   - Currently duplicated in TimerCard, TimerList, SummaryWidget

2. **useInterval**
   - Declarative interval management
   - Auto-cleanup on unmount
   - Currently manually managed in 3 places

3. **useAsync**
   - API call state (loading, error, data)
   - Currently duplicated in every component
   - Should centralize loading/error patterns

4. **useLocalStorage**
   - Persist timer state
   - Currently not implemented at all

5. **useDebounce**
   - For search input
   - Currently search runs on every keystroke

6. **useFormatTime**
   - Memoized time formatting
   - Currently duplicated 3 times

### Missing useContext
1. **ThemeContext**
   - Dark mode state
   - Theme configuration
   
2. **TimerConfigContext**
   - Global timer settings
   - Auto-save preferences

### Testing Issues
- Components are too large to test effectively
- Logic is not isolated in custom hooks
- Cannot test timer behavior without UI
- Interval/timeout mocking is fragile

---

## 🎯 Priority Fixes

### High Priority (Breaks Functionality)
1. **Timer interval cleanup** - Memory leaks
2. **useEffect dependencies** - Stale closures
3. **Interval IDs in state** - Unnecessary re-renders

### Medium Priority (Performance)
1. **useMemo for expensive calculations**
2. **useCallback for event handlers**
3. **Extract derived state from useEffect**

### Low Priority (Code Quality)
1. **Extract custom hooks**
2. **Add useContext for theme**
3. **Split large components**
4. **Add proper TypeScript types**

---

## 📚 Learning Checkpoints

After fixing these issues, you should understand:

- ✅ When to use `useState` vs `useReducer`
- ✅ How to properly manage side effects with `useEffect`
- ✅ When and how to use `useMemo` and `useCallback`
- ✅ Proper use of `useRef` for mutable values
- ✅ How to create custom hooks
- ✅ When to use `useContext`
- ✅ How to test hooks in isolation
- ✅ Performance optimization techniques

---

## 🔧 Recommended Fix Order

1. **Phase 1**: Extract Custom Hooks
   - Create `useTimer`
   - Create `useInterval`
   - Create `useAsync`

2. **Phase 2**: Fix Side Effects
   - Add cleanup functions
   - Fix dependency arrays
   - Move intervals to refs

3. **Phase 3**: Optimize Performance
   - Add `useMemo` for calculations
   - Add `useCallback` for handlers
   - Add `React.memo` for components

4. **Phase 4**: Refactor State
   - Replace `useState` with `useReducer` in TimerList
   - Create reducer functions

5. **Phase 5**: Add Context
   - Create ThemeContext
   - Create TimerConfigContext

6. **Phase 6**: Testing
   - Write tests for custom hooks
   - Add integration tests
   - Test cleanup behavior

---

*This document serves as a roadmap for fixing the intentional anti-patterns in this educational codebase.*
