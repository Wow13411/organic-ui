import { describe, it, expect, beforeEach, vi } from 'vitest'
import { a } from '../../src/components/a.js'
import { state } from '../../src/reactivity.js'
import { awaitMicrotask } from '../test-utils.js'

describe('a component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should create anchor with static href', () => {
    const link = a({ href: 'https://example.com', text: 'Click me' })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el).toBeTruthy()
    expect(el?.href).toBe('https://example.com/')
    expect(el?.textContent).toBe('Click me')
  })

  it('should create anchor with reactive href', async () => {
    const [url, setUrl] = state('https://example.com')
    const link = a({ href: url, text: 'Link' })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.href).toBe('https://example.com/')

    setUrl('https://other.com')

    await awaitMicrotask()
    expect(el?.href).toBe('https://other.com/')
  })

  it('should create anchor with reactive text', async () => {
    const [text, setText] = state('Initial')
    const link = a({ href: '#', text })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.textContent).toBe('Initial')

    setText('Updated')

    await awaitMicrotask()
    expect(el?.textContent).toBe('Updated')
  })

  it('should handle target and rel attributes', () => {
    const link = a({
      href: 'https://example.com',
      text: 'Link',
      target: '_blank',
      rel: 'noopener noreferrer'
    })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.target).toBe('_blank')
    expect(el?.rel).toBe('noopener noreferrer')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    const link = a({
      href: '#',
      text: 'Click',
      onClick: handleClick
    })
    link.mount(container)

    const el = container.querySelector('a')
    el?.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle static className', () => {
    const link = a({
      href: '#',
      text: 'Link',
      class: 'my-link active'
    })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.className).toBe('my-link active')
  })

  it('should handle reactive className', async () => {
    const [className, setClassName] = state('initial')
    const link = a({
      href: '#',
      text: 'Link',
      class: className
    })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.className).toBe('initial')

    setClassName('updated active')

    await awaitMicrotask()
    expect(el?.className).toBe('updated active')
  })

  it('should handle static styles', () => {
    const link = a({
      href: '#',
      text: 'Link',
      style: { color: 'red', fontSize: '16px' }
    })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.style.color).toBe('red')
    expect(el?.style.fontSize).toBe('16px')
  })

  it('should handle reactive styles', async () => {
    const [color, setColor] = state('red')
    const link = a({
      href: '#',
      text: 'Link',
      style: () => ({ color: color() })
    })
    link.mount(container)

    const el = container.querySelector('a')
    expect(el?.style.color).toBe('red')

    setColor('blue')

    await awaitMicrotask()
    expect(el?.style.color).toBe('blue')
  })

  it('should mount children', () => {
    const child = {
      mount(parent: HTMLElement) {
        const span = document.createElement('span')
        span.textContent = 'Child'
        parent.appendChild(span)
        return () => span.remove()
      }
    }

    const link = a({
      href: '#',
      children: [child]
    })
    link.mount(container)

    const el = container.querySelector('a')
    const span = el?.querySelector('span')
    expect(span?.textContent).toBe('Child')
  })

  it('should cleanup on unmount', async () => {
    const [text, setText] = state('Initial')
    const link = a({ href: '#', text })
    const cleanup = link.mount(container)

    const el = container.querySelector('a')
    expect(el).toBeTruthy()

    cleanup()

    expect(container.querySelector('a')).toBeNull()

    // After cleanup, changing state should not affect anything
    setText('Updated')

    await awaitMicrotask()
    expect(container.querySelector('a')).toBeNull()
  })
})
