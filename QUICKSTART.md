# Quick Start Guide

Get up and running with the Timer & Task Management Dashboard in minutes!

## 🚀 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# The app will be running at http://localhost:5173
```

## 📱 Using the Application

### Creating a Timer
1. Click "Add Timer" button
2. Enter timer name and description
3. Click "Create Timer"

### Managing Timers
- **Start**: Begin tracking time
- **Pause**: Stop tracking (keeps elapsed time)
- **Reset**: Reset timer to 00:00:00
- **Edit**: Modify timer name/description
- **Delete**: Remove timer

### Viewing Statistics
- Click "Summary" in the header to see dashboard
- View total timers, running/paused counts
- See productivity metrics and time breakdowns

### Filters & Search
- **Search**: Type in search box to filter by name/description
- **Status Filter**: All / Running / Paused
- **Sort By**: Date / Name / Elapsed Time

## 🧪 Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm test -- --run
```

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure Overview

```
Hooks-practices/
├── src/
│   ├── components/
│   │   ├── TimerCard.tsx        # Individual timer (320+ lines) ❌
│   │   ├── TimerList.tsx        # Timer management (400+ lines) ❌
│   │   └── SummaryWidget.tsx    # Statistics (280+ lines) ❌
│   ├── api/
│   │   └── timerApi.ts          # Mock API
│   ├── types/
│   │   └── timer.ts             # TypeScript types
│   ├── test/
│   │   ├── setup.ts             # Test config
│   │   └── TimerCard.test.tsx   # Example test
│   ├── App.tsx                   # Main component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind styles
├── PROBLEMS.md                   # Detailed anti-patterns catalog
├── README.md                     # Full documentation
├── CONTRIBUTING.md               # How to contribute
└── package.json                  # Dependencies & scripts
```

## ⚠️ Known Issues (Intentional)

This codebase contains intentional React Hooks anti-patterns:

1. **Memory Leaks**: Timers don't cleanup properly
2. **Performance**: No memoization, recalculates on every render
3. **State Management**: Too many `useState`, should use `useReducer`
4. **Side Effects**: Missing dependency arrays and cleanup
5. **Code Duplication**: Timer logic repeated 3 times
6. **No Custom Hooks**: All logic inline in components

See `PROBLEMS.md` for complete catalog.

## 🎓 Learning Path

1. **Read** `PROBLEMS.md` to understand all issues
2. **Review** component code and look for ❌ comments
3. **Create** PRs to fix specific problems (see `CONTRIBUTING.md`)
4. **Test** your fixes with tests

## 🔧 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and build |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 💡 Tips

- **StrictMode**: Enabled by default, helps catch issues
- **Hot Reload**: Changes reflect immediately
- **TypeScript**: Strict mode enabled for better type safety
- **Tailwind**: IntelliSense available with Tailwind CSS extension
- **Testing**: Uses Vitest + React Testing Library

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Tests failing
```bash
# Update snapshots if needed
npm test -- -u
```

## 📚 Next Steps

1. ✅ Project is running
2. 📖 Read `README.md` for full context
3. 🔍 Explore `PROBLEMS.md` to see all anti-patterns
4. 🛠️ Pick an issue and create a PR (see `CONTRIBUTING.md`)
5. 🧪 Write tests for your fixes

## 🤝 Getting Help

- Check documentation files in the project root
- Review React Hooks documentation: https://react.dev/reference/react
- Open an issue for questions

---

**You're all set! Happy coding! 🎉**

Start with: `npm run dev`
