# Organic UI Tests

Comprehensive test suite for Organic UI using Vitest and happy-dom.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

```
tests/
├── reactivity.test.ts      # Reactivity system (state, effect, memo, createRoot)
├── renderer.test.ts         # Renderer functionality
├── components/              # Component tests
│   ├── a.test.ts           # Anchor component
│   ├── button.test.ts      # Button component
│   ├── for.test.ts         # For loop component
│   ├── show.test.ts        # Show conditional component
│   └── switch.test.ts      # Switch component
└── utils/
    └── bind.test.ts        # Binding utilities
```

## Test Coverage

**Total: 91 tests (85 passing, 6 skipped)**

### Reactivity System (17 tests)
- ✅ State management
- ✅ Effect tracking and re-execution
- ✅ Memoization
- ✅ Root scope creation and cleanup
- ⏭️ Edge cases with disposal timing (2 skipped)

### Components (58 tests)
- ✅ Anchor (`a`) - 11 tests
- ✅ Button - 12 tests
- ✅ For loop - 11 tests (3 skipped)
- ✅ Show conditional - 9 tests
- ✅ Switch - 12 tests

### Core Functionality (16 tests)
- ✅ Renderer - 4 tests
- ✅ Bind utilities - 12 tests

## Known Issues (Skipped Tests)

The following tests are skipped and marked as known issues that need investigation:

### Reactivity System
1. **`createRoot` disposal with in-flight updates** - Effects may still fire if state updates are in flight when dispose is called
2. **Nested effects disposal** - Similar issue with nested effect cleanup
3. **Memo in effects** - Async update timing with memoized values in effects

### For Component
1. **Keyed reconciliation with reordering** - DOM reordering with keyed items needs investigation (3 tests)

These represent edge cases that don't affect typical usage but should be addressed for production-ready code.

## Testing Tools

- **Vitest**: Fast, modern test runner with ESM support
- **happy-dom**: Lightweight DOM implementation for Node.js
- **Vitest UI**: Interactive test UI for debugging

## Writing New Tests

Tests use the standard Vitest API:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { state, effect } from '../src/reactivity.js'

describe('My Feature', () => {
  it('should work correctly', () => {
    const [value] = state(10)
    expect(value()).toBe(10)
  })
})
```

### Testing Async Reactive Updates

Use the `awaitMicrotask` utility for cleaner async tests:

```typescript
import { awaitMicrotask } from './test-utils.js'

it('should update reactively', async () => {
  const [value, setValue] = state(0)
  setValue(10)
  
  await awaitMicrotask()
  expect(value()).toBe(10)
})
```

For operations requiring multiple microtask cycles:

```typescript
import { awaitMicrotasks } from './test-utils.js'

it('should handle complex updates', async () => {
  // ... setup
  await awaitMicrotasks(2) // Wait for 2 microtask cycles
  // ... assertions
})
```

## Test Environment

- **Environment**: happy-dom (browser-like DOM in Node.js)
- **Globals**: Enabled (no need to import `describe`, `it`, `expect`)
- **Coverage**: v8 provider with text, JSON, and HTML reports
