## Project Summary

This is a Timer & Task Management Dashboard built with React 18, TypeScript, Vite, Tailwind CSS, and Vitest. 

**Important**: This project intentionally contains React Hooks anti-patterns for educational purposes. The codebase demonstrates common mistakes and provides a foundation for learning proper hook implementation through PRs.

## Project Structure
- `src/components/` - React components with intentional anti-patterns
- `src/api/` - Mock API for timer persistence
- `src/types/` - TypeScript interfaces
- `src/test/` - Test files and setup

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI

## Key Files
- `PROBLEMS.md` - Detailed catalog of all anti-patterns
- `README.md` - Project overview and learning objectives
- `CONTRIBUTING.md` - Guide for contributing fixes

## Development Notes
- Components intentionally exceed 300 lines
- No custom hooks (should be extracted)
- Missing useMemo/useCallback optimizations
- useEffect cleanup functions missing
- Interval IDs stored in state instead of refs
- Logic duplicated across components
