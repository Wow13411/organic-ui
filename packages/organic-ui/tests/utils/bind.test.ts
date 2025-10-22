import { describe, it, expect, vi } from 'vitest'
import { bind, bindAssign } from '../../src/utils/bind.js'
import { state } from '../../src/reactivity.js'
import { awaitMicrotask } from '../test-utils.js'

describe('bind utility', () => {
  it('should set static value immediately', async () => {
    const setter = vi.fn()
    bind('static value', setter)

    expect(setter).toHaveBeenCalledWith('static value')
    expect(setter).toHaveBeenCalledTimes(1)
  })

  it('should create effect for function value', async () => {
    const [value] = state('initial')
    const setter = vi.fn()

    bind(value, setter)

    expect(setter).toHaveBeenCalledWith('initial')
    expect(setter).toHaveBeenCalledTimes(1)
  })

  it('should update when reactive value changes', async () => {
    const [value, setValue] = state('initial')
    const setter = vi.fn()

    bind(value, setter)

    expect(setter).toHaveBeenCalledWith('initial')
    expect(setter).toHaveBeenCalledTimes(1)

    setValue('updated')

    await awaitMicrotask()
    expect(setter).toHaveBeenCalledWith('updated')
    expect(setter).toHaveBeenCalledTimes(2)
  })

  it('should handle number values', async () => {
    const setter = vi.fn()
    bind(42, setter)

    expect(setter).toHaveBeenCalledWith(42)
  })

  it('should handle boolean values', async () => {
    const setter = vi.fn()
    bind(true, setter)

    expect(setter).toHaveBeenCalledWith(true)
  })

  it('should handle reactive number values', async () => {
    const [count, setCount] = state(0)
    const setter = vi.fn()

    bind(count, setter)

    expect(setter).toHaveBeenCalledWith(0)

    setCount(10)

    await awaitMicrotask()
    expect(setter).toHaveBeenCalledWith(10)
  })
})

describe('bindAssign utility', () => {
  it('should assign static object immediately', async () => {
    const target = { a: 1, b: 2 }
    const source = { b: 20, c: 30 }

    bindAssign(source, target)

    expect(target).toEqual({ a: 1, b: 20, c: 30 })
  })

  it('should create effect for function value', async () => {
    const [color] = state('red')
    const target = { color: 'blue', fontSize: '12px' }

    bindAssign(() => ({ color: color() }), target)

    expect(target.color).toBe('red')
    expect(target.fontSize).toBe('12px')
  })

  it('should update when reactive value changes', async () => {
    const [color, setColor] = state('red')
    const target = { color: 'blue' }

    bindAssign(() => ({ color: color() }), target)

    expect(target.color).toBe('red')

    setColor('green')

    await awaitMicrotask()
    expect(target.color).toBe('green')
  })

  it('should work with CSSStyleDeclaration', async () => {
    const [color, setColor] = state('red')
    const el = document.createElement('div')

    bindAssign(() => ({ color: color(), fontSize: '16px' }), el.style)

    expect(el.style.color).toBe('red')
    expect(el.style.fontSize).toBe('16px')

    setColor('blue')

    await awaitMicrotask()
    expect(el.style.color).toBe('blue')
    expect(el.style.fontSize).toBe('16px')
  })

  it('should handle multiple reactive properties', async () => {
    const [color, setColor] = state('red')
    const [size, setSize] = state('12px')
    const target: any = {}

    bindAssign(() => ({ color: color(), fontSize: size() }), target)

    expect(target.color).toBe('red')
    expect(target.fontSize).toBe('12px')

    setColor('blue')

    return new Promise(resolve => {
      queueMicrotask(() => {
        expect(target.color).toBe('blue')
        expect(target.fontSize).toBe('12px')

        setSize('16px')

        queueMicrotask(() => {
          expect(target.color).toBe('blue')
          expect(target.fontSize).toBe('16px')
          resolve()
        })
      })
    })
  })

  it('should preserve existing properties not in source', async () => {
    const target = { a: 1, b: 2, c: 3 }
    const source = { b: 20 }

    bindAssign(source, target)

    expect(target).toEqual({ a: 1, b: 20, c: 3 })
  })
})
