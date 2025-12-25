# Contributing Guide

Thank you for your interest in improving this project! This guide will help you contribute effectively.

## 🎯 Project Goal

This is an **educational project** designed to teach React Hooks best practices by fixing intentional anti-patterns. Each fix should be submitted as a separate Pull Request with detailed explanations.

## 🔧 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Hooks-practices.git
   cd Hooks-practices
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 PR Guidelines

### PR Structure

Each PR should focus on **ONE specific improvement category**:

1. **Custom Hooks PRs**
   - Extract one hook per PR
   - Include tests for the hook
   - Update components to use the hook
   - Document the hook's API

2. **Performance Optimization PRs**
   - Add `useMemo`/`useCallback` to specific component
   - Show before/after performance metrics
   - Explain why optimization was needed

3. **Side Effects Fix PRs**
   - Fix specific `useEffect` issues
   - Add cleanup functions
   - Fix dependency arrays
   - Explain the bug being fixed

4. **State Management PRs**
   - Convert `useState` to `useReducer`
   - Create reducer and actions
   - Add tests for reducer logic

### PR Template

```markdown
## Problem Being Solved

[Reference specific line numbers and problems from PROBLEMS.md]

## Changes Made

- [ ] Detailed change 1
- [ ] Detailed change 2
- [ ] Tests added/updated

## Before & After

### Before
```typescript
// Show problematic code
```

### After
```typescript
// Show fixed code
```

## How to Test

1. Step-by-step testing instructions
2. Expected behavior

## Learning Outcomes

What React Hooks concepts does this PR demonstrate?

## Related Issues

Closes #XX
```

### Commit Message Format

```
type(scope): brief description

Detailed explanation of what and why

Fixes: List problems from PROBLEMS.md
```

**Types:**
- `feat`: New custom hook or feature
- `fix`: Bug fix (useEffect cleanup, dependencies, etc.)
- `perf`: Performance improvement (useMemo, useCallback)
- `refactor`: Code restructuring
- `test`: Adding tests
- `docs`: Documentation updates

**Examples:**
```
feat(hooks): add useTimer custom hook

Extract timer logic into reusable custom hook.
Includes start, pause, reset, and elapsed time management.

Fixes: TimerCard.tsx line 45-60 (interval management)
Fixes: Duplicated timer logic across 3 components
```

```
perf(TimerList): add useMemo for expensive calculations

Memoize totalElapsed, runningCount, and pausedCount
to prevent recalculation on every render.

Fixes: TimerList.tsx line 29-32
```

## 🧪 Testing Requirements

### For Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  it('should start and increment timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
  });
});
```

### For Component Changes
- Add integration tests showing the fix works
- Test edge cases
- Test cleanup (for useEffect fixes)

## 📊 PR Categories & Priority

### High Priority (Breaks Functionality)
1. Timer interval cleanup
2. useEffect dependency arrays
3. Interval IDs stored in state

### Medium Priority (Performance)
1. useMemo for calculations
2. useCallback for handlers
3. Derived state optimization

### Low Priority (Code Quality)
1. Custom hook extraction
2. Context API implementation
3. Component splitting

## 🎓 Educational Requirements

Each PR should include:

1. **Problem Explanation**
   - What was wrong
   - Why it was a problem
   - Which React Hooks concept it violates

2. **Solution Explanation**
   - How you fixed it
   - Which hook(s) you used
   - Why this is the correct approach

3. **Learning Notes**
   - Key takeaways
   - Links to React documentation
   - Common pitfalls to avoid

## 📋 Checklist Before Submitting

- [ ] Code compiles without errors (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Code is properly typed (TypeScript)
- [ ] Comments explain the "why"
- [ ] PR description is detailed
- [ ] Related problems from PROBLEMS.md are referenced
- [ ] Learning outcomes are documented

## 🚫 What NOT to Do

❌ **Don't** fix multiple unrelated problems in one PR
❌ **Don't** change code style without functional improvements
❌ **Don't** remove the educational comments (❌ PROBLEM: ...)
❌ **Don't** add new features not related to hooks learning
❌ **Don't** modify the core functionality of the app

## ✅ What TO Do

✅ **Do** focus on one specific hook concept per PR
✅ **Do** add comprehensive tests
✅ **Do** explain your changes clearly
✅ **Do** reference React documentation
✅ **Do** keep the educational nature of the project

## 📚 Recommended Learning Path

1. **Week 1**: Custom Hooks
   - Create `useTimer`
   - Create `useInterval`
   - Create `useAsync`

2. **Week 2**: Performance Optimization
   - Add `useMemo` to SummaryWidget
   - Add `useCallback` to event handlers
   - Implement `React.memo`

3. **Week 3**: Side Effects
   - Fix useEffect cleanups
   - Fix dependency arrays
   - Move intervals to useRef

4. **Week 4**: Advanced Patterns
   - Implement useReducer
   - Add useContext
   - Compose custom hooks

## 🤝 Code Review Process

PRs will be reviewed for:
- Correctness of hook usage
- Test coverage
- Code clarity
- Educational value
- Documentation quality

## 💬 Questions?

- Check [React Hooks Documentation](https://react.dev/reference/react)
- Review PROBLEMS.md for detailed issue descriptions
- Open a discussion issue for clarification

---

**Remember**: The goal is not just to fix the code, but to **understand and explain** React Hooks concepts deeply.

Happy Learning! 🚀
