import { describe, it, expect } from 'vitest'
import { state } from '../src/reactivity.js'
import { awaitMicrotask, awaitMicrotasks } from './test-utils.js'

describe('Test Utilities', () => {
  describe('awaitMicrotask', () => {
    it('should wait for a single microtask', async () => {
      const [count, setCount] = state(0)

      setCount(10)

      await awaitMicrotask()
      expect(count()).toBe(10)
    })

    it('should handle multiple state updates in one microtask', async () => {
      const [count, setCount] = state(0)
      const [name, setName] = state('Alice')

      setCount(5)
      setName('Bob')

      await awaitMicrotask()
      expect(count()).toBe(5)
      expect(name()).toBe('Bob')
    })
  })

  describe('awaitMicrotasks', () => {
    it('should wait for multiple microtasks', async () => {
      const [count, setCount] = state(0)

      setCount(1)
      await awaitMicrotasks(2)

      expect(count()).toBe(1)
    })

    it('should work with default count of 1', async () => {
      const [count, setCount] = state(0)

      setCount(5)
      await awaitMicrotasks()

      expect(count()).toBe(5)
    })
  })
})
