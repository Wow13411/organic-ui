type Fn = () => void
type CleanupFn = () => void
type EffectFn = () => void | CleanupFn

let currentEffect: Fn | null = null

// Owner-based cleanup tracking
interface Owner {
  cleanups: CleanupFn[]
  context: Owner | null
}

let currentOwner: Owner | null = null

function createOwner(): Owner {
  return {
    cleanups: [],
    context: currentOwner
  }
}

// Auto-batching state
let updateScheduled = false
let pendingUpdates = new Set<Fn>()

/**
 * Schedule an effect to run in the next microtask
 * Multiple updates in the same synchronous block are automatically batched
 */
function scheduleUpdate(fn: Fn) {
  pendingUpdates.add(fn)

  if (!updateScheduled) {
    updateScheduled = true
    queueMicrotask(() => {
      updateScheduled = false

      // Run all pending updates in one batch
      const updates = Array.from(pendingUpdates)
      pendingUpdates.clear()

      for (const update of updates) {
        update()
      }
    })
  }
}


type StateGetter<T> = () => T;
type UpdateFn<T> = (prev: T) => T;
type SetterFn<T> = T | UpdateFn<T>;
type StateSetter<T> = (nextOrFn: SetterFn<T>) => void;

export function state<T>(initial: T): readonly [StateGetter<T>, StateSetter<T>] {
  let value = initial
  const subs = new Set<Fn>()

  function get(): T {
    if (currentEffect) subs.add(currentEffect)
    return value
  }

  function set(nextOrFn: SetterFn<T>): void {
    const next = typeof nextOrFn === "function" ? (nextOrFn as UpdateFn<T>)(value) : nextOrFn
    if (next !== value) {
      value = next

      // Auto-batch all updates using microtask scheduling
      for (const fn of subs) {
        scheduleUpdate(fn)
      }
    }
  }

  return [get, set] as const
}

/**
 * Create a root scope for reactive computations
 * All effects created within this scope will be automatically cleaned up
 * when the root is disposed
 */
export function createRoot<T>(fn: () => T): { value: T; dispose: () => void } {
  const owner = createOwner()
  const prevOwner = currentOwner
  currentOwner = owner

  try {
    const value = fn()
    return {
      value,
      dispose: () => {
        // Run all cleanups in reverse order
        for (let i = owner.cleanups.length - 1; i >= 0; i--) {
          owner.cleanups[i]()
        }
        owner.cleanups.length = 0
      }
    }
  } finally {
    currentOwner = prevOwner
  }
}

/**
 * Run a reactive effect that automatically re-runs when dependencies change
 * Effects are automatically cleaned up when their owner scope is disposed
 */
export function effect(fn: EffectFn): void {
  let cleanup: CleanupFn | void

  const run = () => {
    // Run cleanup from previous execution
    if (cleanup) cleanup()

    currentEffect = run
    cleanup = fn()
    currentEffect = null
  }
  run()

  // Create dispose function for cleanup
  const dispose = () => {
    if (cleanup) cleanup()
  }

  // Auto-register with current owner for automatic cleanup
  if (currentOwner) {
    currentOwner.cleanups.push(dispose)
  }
}

/**
 * Create a memoized computed value that only recomputes when dependencies change
 * Returns a getter function that caches the result until dependencies update
 */
export function memo<T>(fn: () => T): () => T {
  let value: T
  const subs = new Set<Fn>()

  // Create an effect that recomputes when dependencies change
  effect(() => {
    value = fn()

    // Notify subscribers that the value has changed
    for (const sub of subs) {
      scheduleUpdate(sub)
    }
  })

  // Return a getter that subscribes to the memo
  return (): T => {
    if (currentEffect) subs.add(currentEffect)
    return value
  }
}
