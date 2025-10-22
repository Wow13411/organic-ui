import { describe, it, expect, beforeEach } from 'vitest'
import { Show } from '../../src/components/show.js'
import { state } from '../../src/reactivity.js'
import type { Renderable } from '../../src/types.js'
import { awaitMicrotask, awaitMicrotasks } from '../test-utils.js'

describe('Show component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  const createTextComponent = (text: string): Renderable => ({
    mount(parent: HTMLElement) {
      const el = document.createElement('div')
      el.textContent = text
      parent.appendChild(el)
      return () => el.remove()
    }
  })

  it('should show children when condition is true', async () => {
    const [show] = state(true)
    const component = Show({
      when: show,
      children: createTextComponent('Visible')
    })

    component.mount(container)
    expect(container.textContent).toBe('Visible')
  })

  it('should not show children when condition is false', async () => {
    const [show] = state(false)
    const component = Show({
      when: show,
      children: createTextComponent('Hidden')
    })

    component.mount(container)
    expect(container.textContent).toBe('')
  })

  it('should show fallback when condition is false', async () => {
    const [show] = state(false)
    const component = Show({
      when: show,
      children: createTextComponent('Main'),
      fallback: createTextComponent('Fallback')
    })

    component.mount(container)
    expect(container.textContent).toBe('Fallback')
  })

  it('should toggle between children and fallback', async () => {
    const [show, setShow] = state(true)
    const component = Show({
      when: show,
      children: createTextComponent('Main'),
      fallback: createTextComponent('Fallback')
    })

    component.mount(container)
    expect(container.textContent).toBe('Main')

    setShow(false)

    await awaitMicrotask()
    expect(container.textContent).toBe('Fallback')

    setShow(true)
    await awaitMicrotask()
    expect(container.textContent).toBe('Main')
  })

  it('should handle function children', async () => {
    const [show] = state(true)
    const component = Show({
      when: show,
      children: () => createTextComponent('Lazy')
    })

    component.mount(container)
    expect(container.textContent).toBe('Lazy')
  })

  it('should handle function fallback', async () => {
    const [show] = state(false)
    const component = Show({
      when: show,
      children: createTextComponent('Main'),
      fallback: () => createTextComponent('Lazy Fallback')
    })

    component.mount(container)
    expect(container.textContent).toBe('Lazy Fallback')
  })

  it('should cleanup previous renderable when condition changes', async () => {
    const [show, setShow] = state(true)
    const component = Show({
      when: show,
      children: createTextComponent('Main'),
      fallback: createTextComponent('Fallback')
    })

    component.mount(container)
    const firstDiv = container.querySelector('div')
    expect(firstDiv?.textContent).toBe('Main')

    setShow(false)

    await awaitMicrotask()
    expect(firstDiv?.isConnected).toBe(false) // Previous element removed
    const secondDiv = container.querySelector('div')
    expect(secondDiv?.textContent).toBe('Fallback')
  })

  it('should unmount properly', async () => {
    const [show] = state(true)
    const component = Show({
      when: show,
      children: createTextComponent('Main')
    })

    const cleanup = component.mount(container)
    expect(container.textContent).toBe('Main')

    cleanup()
    expect(container.textContent).toBe('')
  })

  it('should handle rapid condition changes', async () => {
    const [show, setShow] = state(true)
    const component = Show({
      when: show,
      children: createTextComponent('Main'),
      fallback: createTextComponent('Fallback')
    })

    component.mount(container)
    expect(container.textContent).toBe('Main')

    // Multiple rapid changes
    setShow(false)
    setShow(true)
    setShow(false)

    await awaitMicrotask()
    expect(container.textContent).toBe('Fallback')
  })
})
