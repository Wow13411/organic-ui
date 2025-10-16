type Fn = () => void
type CleanupFn = () => void
type EffectFn = () => void | CleanupFn

let currentEffect: Fn | null = null

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

export function state<T>(initial: T) {
  let value = initial
  const subs = new Set<Fn>()

  function get(): T {
    if (currentEffect) subs.add(currentEffect)
    return value
  }

  function set(nextOrFn: T | ((prev: T) => T)) {
    const next = typeof nextOrFn === "function" ? (nextOrFn as (prev: T) => T)(value) : nextOrFn
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

// run a reactive effect
export function effect(fn: EffectFn) {
  let cleanup: CleanupFn | void
  
  const run = () => {
    // Run cleanup from previous execution
    if (cleanup) cleanup()
    
    currentEffect = run
    cleanup = fn()
    currentEffect = null
  }
  run()
  
  // Return a dispose function to stop the effect and run cleanup
  return () => {
    if (cleanup) cleanup()
  }
}
