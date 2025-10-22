import { describe, it, expect, beforeEach, vi } from 'vitest'
import { button } from '../../src/components/button.js'
import { state } from '../../src/reactivity.js'
import { awaitMicrotask } from '../test-utils.js'

describe('button component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should create button with static text', () => {
    const handleClick = vi.fn()
    const btn = button({ text: 'Click me', onClick: handleClick })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el).toBeTruthy()
    expect(el?.textContent).toBe('Click me')
  })

  it('should create button with reactive text', async () => {
    const [text, setText] = state('Initial')
    const handleClick = vi.fn()
    const btn = button({ text, onClick: handleClick })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.textContent).toBe('Initial')

    setText('Updated')

    await awaitMicrotask()
    expect(el?.textContent).toBe('Updated')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    const btn = button({ text: 'Click', onClick: handleClick })
    btn.mount(container)

    const el = container.querySelector('button')
    el?.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle static className', () => {
    const handleClick = vi.fn()
    const btn = button({
      text: 'Button',
      onClick: handleClick,
      class: 'btn-primary'
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.className).toBe('btn-primary')
  })

  it('should handle reactive className', async () => {
    const [className, setClassName] = state('initial')
    const handleClick = vi.fn()
    const btn = button({
      text: 'Button',
      onClick: handleClick,
      class: className
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.className).toBe('initial')

    setClassName('updated active')

    await awaitMicrotask()
    expect(el?.className).toBe('updated active')
  })

  it('should handle static styles', () => {
    const handleClick = vi.fn()
    const btn = button({
      text: 'Button',
      onClick: handleClick,
      style: { color: 'red', fontSize: '16px' }
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.style.color).toBe('red')
    expect(el?.style.fontSize).toBe('16px')
  })

  it('should handle reactive styles', async () => {
    const [color, setColor] = state('red')
    const handleClick = vi.fn()
    const btn = button({
      text: 'Button',
      onClick: handleClick,
      style: () => ({ color: color() })
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.style.color).toBe('red')

    setColor('blue')

    await awaitMicrotask()
    expect(el?.style.color).toBe('blue')
  })

  it('should mount children', () => {
    const handleClick = vi.fn()
    const child = {
      mount(parent: HTMLElement) {
        const span = document.createElement('span')
        span.textContent = 'Child'
        parent.appendChild(span)
        return () => span.remove()
      }
    }

    const btn = button({
      onClick: handleClick,
      children: [child]
    })
    btn.mount(container)

    const el = container.querySelector('button')
    const span = el?.querySelector('span')
    expect(span?.textContent).toBe('Child')
  })

  it('should not render text when children are present', () => {
    const handleClick = vi.fn()
    const child = {
      mount(parent: HTMLElement) {
        const span = document.createElement('span')
        span.textContent = 'Child'
        parent.appendChild(span)
        return () => span.remove()
      }
    }

    // @ts-ignore
    const btn = button({
      text: 'This should not render',
      onClick: handleClick,
      children: [child]
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.textContent).toBe('Child')
  })

  it('should filter out null/undefined children', () => {
    const handleClick = vi.fn()
    const child = {
      mount(parent: HTMLElement) {
        const span = document.createElement('span')
        span.textContent = 'Valid'
        parent.appendChild(span)
        return () => span.remove()
      }
    }

    const btn = button({
      onClick: handleClick,
      children: [child, null as any, undefined as any]
    })
    btn.mount(container)

    const el = container.querySelector('button')
    const spans = el?.querySelectorAll('span')
    expect(spans?.length).toBe(1)
  })

  it('should cleanup on unmount', async () => {
    const [text, setText] = state('Initial')
    const handleClick = vi.fn()
    const btn = button({ text, onClick: handleClick })
    const cleanup = btn.mount(container)

    const el = container.querySelector('button')
    expect(el).toBeTruthy()

    cleanup()

    expect(container.querySelector('button')).toBeNull()

    // After cleanup, changing state should not affect anything
    setText('Updated')

    await awaitMicrotask()
    expect(container.querySelector('button')).toBeNull()
  })

  it('should allow empty className string', () => {
    const handleClick = vi.fn()
    const btn = button({
      text: 'Button',
      onClick: handleClick,
      class: ''
    })
    btn.mount(container)

    const el = container.querySelector('button')
    expect(el?.className).toBe('')
  })
})
