/**
 * Test utility functions for organic-ui tests
 */

/**
 * Wait for a microtask to complete.
 * Useful for testing reactive updates which are batched in microtasks.
 * 
 * @example
 * const [count, setCount] = state(0)
 * setCount(10)
 * await awaitMicrotask()
 * expect(count()).toBe(10)
 */
export function awaitMicrotask(): Promise<void> {
  return new Promise(resolve => {
    queueMicrotask(resolve)
  })
}

/**
 * Wait for multiple microtasks to complete.
 * Useful when testing operations that require multiple microtask cycles.
 * 
 * @param count - Number of microtasks to wait for (default: 1)
 * 
 * @example
 * await awaitMicrotasks(2)
 */
export async function awaitMicrotasks(count: number = 1): Promise<void> {
  for (let i = 0; i < count; i++) {
    await awaitMicrotask()
  }
}
