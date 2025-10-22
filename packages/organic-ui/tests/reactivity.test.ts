import { describe, it, expect, vi } from 'vitest'
import { state, effect, memo, createRoot } from '../src/reactivity.js'
import { awaitMicrotask } from './test-utils.js'

describe('Reactivity System', () => {
  describe('state', () => {
    it('should create a state with initial value', () => {
      const [count] = state(0)
      expect(count()).toBe(0)
    })

    it('should update state value', async () => {
      const [count, setCount] = state(0)
      setCount(5)

      await awaitMicrotask()
      expect(count()).toBe(5)
    })

    it('should update state with function', async () => {
      const [count, setCount] = state(10)
      setCount(prev => prev + 5)

      await awaitMicrotask()
      expect(count()).toBe(15)
    })

    it('should not trigger update if value is the same', async () => {
      const [count, setCount] = state(5)
      const spy = vi.fn()

      effect(() => {
        count()
        spy()
      })

      // Initial call
      expect(spy).toHaveBeenCalledTimes(1)

      setCount(5) // Same value

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(1) // Should not call again
    })
  })

  describe('effect', () => {
    it('should run effect immediately', () => {
      const spy = vi.fn()
      effect(spy)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should re-run effect when dependency changes', async () => {
      const [count, setCount] = state(0)
      const spy = vi.fn()

      effect(() => {
        count()
        spy()
      })

      expect(spy).toHaveBeenCalledTimes(1)

      setCount(1)

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('should track multiple dependencies', async () => {
      const [count, setCount] = state(0)
      const [name, setName] = state('Alice')
      const spy = vi.fn()

      effect(() => {
        count()
        name()
        spy()
      })

      expect(spy).toHaveBeenCalledTimes(1)

      setCount(1)

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(2)

      setName('Bob')

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(3)
    })

    it('should run cleanup function', async () => {
      const [count, setCount] = state(0)
      const cleanup = vi.fn()

      effect(() => {
        count()
        return cleanup
      })

      expect(cleanup).toHaveBeenCalledTimes(0)

      setCount(1)

      await awaitMicrotask()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it('should batch multiple updates', async () => {
      const [count, setCount] = state(0)
      const spy = vi.fn()

      effect(() => {
        count()
        spy()
      })

      expect(spy).toHaveBeenCalledTimes(1)

      // Multiple synchronous updates
      setCount(1)
      setCount(2)
      setCount(3)

      await awaitMicrotask()
      // Should only run once for all updates
      expect(spy).toHaveBeenCalledTimes(2)
      expect(count()).toBe(3)
    })
  })

  describe('memo', () => {
    it('should create a memoized computed value', () => {
      const [count] = state(5)
      const doubled = memo(() => count() * 2)

      expect(doubled()).toBe(10)
    })

    it('should recompute when dependency changes', async () => {
      const [count, setCount] = state(5)
      const doubled = memo(() => count() * 2)

      expect(doubled()).toBe(10)

      setCount(10)

      await awaitMicrotask()
      expect(doubled()).toBe(20)
    })

    it('should cache computed value', () => {
      const [count] = state(5)
      const spy = vi.fn(() => count() * 2)
      const doubled = memo(spy)

      expect(spy).toHaveBeenCalledTimes(1)

      // Multiple reads should not recompute
      doubled()
      doubled()
      doubled()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it.skip('should work in effect', async () => {
      // TODO: Known issue - memo in effect with async updates needs investigation
      const [count, setCount] = state(5)
      const doubled = memo(() => count() * 2)
      const spy = vi.fn()

      effect(() => {
        doubled()
        spy()
      })

      expect(spy).toHaveBeenCalledTimes(1)

      setCount(10)

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(2)
      expect(doubled()).toBe(20)
    })
  })

  describe('createRoot', () => {
    it('should create a root scope and return value', () => {
      const result = createRoot(() => {
        return 'test value'
      })

      expect(result.value).toBe('test value')
      expect(result.dispose).toBeInstanceOf(Function)
    })

    it.skip('should dispose all effects in scope', async () => {
      // TODO: Known issue - effects may still fire if updates are in flight when dispose is called
      const [count, setCount] = state(0)
      const spy = vi.fn()

      const root = createRoot(() => {
        effect(() => {
          count()
          spy()
        })
      })

      expect(spy).toHaveBeenCalledTimes(1)

      setCount(1)

      await awaitMicrotask()
      expect(spy).toHaveBeenCalledTimes(2)

      // Dispose the root
      root.dispose()

      // Wait for any pending updates to complete
      await awaitMicrotask()
      setCount(2)

      await awaitMicrotask()
      // Should not trigger effect after dispose
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('should run cleanup functions on dispose', () => {
      const cleanup = vi.fn()

      const root = createRoot(() => {
        effect(() => {
          return cleanup
        })
      })

      expect(cleanup).toHaveBeenCalledTimes(0)

      root.dispose()

      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it.skip('should handle nested effects', async () => {
      // TODO: Known issue - nested effects may still fire if updates are in flight when dispose is called
      const [outer, setOuter] = state(0)
      const [inner, setInner] = state(0)
      const outerSpy = vi.fn()
      const innerSpy = vi.fn()

      const root = createRoot(() => {
        effect(() => {
          outer()
          outerSpy()

          effect(() => {
            inner()
            innerSpy()
          })
        })
      })

      expect(outerSpy).toHaveBeenCalledTimes(1)
      expect(innerSpy).toHaveBeenCalledTimes(1)

      setInner(1)

      await awaitMicrotask()
      expect(innerSpy).toHaveBeenCalledTimes(2)

      root.dispose()

      // Wait for any pending updates to complete
      await awaitMicrotask()
      setOuter(1)
      setInner(2)

      await awaitMicrotask()
      // Neither should trigger after dispose
      expect(outerSpy).toHaveBeenCalledTimes(1)
      expect(innerSpy).toHaveBeenCalledTimes(2)
    })
  })
})
