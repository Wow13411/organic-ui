import { describe, it, expect, beforeEach } from 'vitest'
import { Switch } from '../../src/components/switch.js'
import { state } from '../../src/reactivity.js'
import type { Renderable } from '../../src/types.js'
import { awaitMicrotask } from '../test-utils.js'

describe('Switch component', () => {
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

  it('should render matching case', async () => {
    const [value] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') },
        { when: 'b', children: createTextComponent('Case B') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('Case A')
  })

  it('should switch between cases', async () => {
    const [value, setValue] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') },
        { when: 'b', children: createTextComponent('Case B') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('Case A')

    setValue('b')

    await awaitMicrotask()
    expect(container.textContent).toBe('Case B')
  })

  it('should render fallback when no case matches', async () => {
    const [value] = state('c')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') },
        { when: 'b', children: createTextComponent('Case B') }
      ],
      fallback: createTextComponent('Default')
    })

    component.mount(container)
    expect(container.textContent).toBe('Default')
  })

  it('should switch to fallback when no match', async () => {
    const [value, setValue] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') },
        { when: 'b', children: createTextComponent('Case B') }
      ],
      fallback: createTextComponent('Default')
    })

    component.mount(container)
    expect(container.textContent).toBe('Case A')

    setValue('c')

    await awaitMicrotask()
    expect(container.textContent).toBe('Default')
  })

  it('should handle multiple children in a case', async () => {
    const [value] = state('a')
    const component = Switch({
      on: value,
      cases: [
        {
          when: 'a',
          children: [
            createTextComponent('First'),
            createTextComponent('Second')
          ]
        }
      ]
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)
    expect(divs[0].textContent).toBe('First')
    expect(divs[1].textContent).toBe('Second')
  })

  it('should handle multiple children in fallback', async () => {
    const [value] = state('c')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') }
      ],
      fallback: [
        createTextComponent('Fallback 1'),
        createTextComponent('Fallback 2')
      ]
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)
    expect(divs[0].textContent).toBe('Fallback 1')
    expect(divs[1].textContent).toBe('Fallback 2')
  })

  it('should use custom matcher', async () => {
    const [value] = state(5)
    const component = Switch({
      on: value,
      matcher: (a, b) => a > b,
      cases: [
        { when: 0, children: createTextComponent('Greater than 0') },
        { when: 10, children: createTextComponent('Greater than 10') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('Greater than 0')
  })

  it('should match first matching case', async () => {
    const [value] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('First Match') },
        { when: 'a', children: createTextComponent('Second Match') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('First Match')
  })

  it('should cleanup previous renderables on switch', async () => {
    const [value, setValue] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') },
        { when: 'b', children: createTextComponent('Case B') }
      ]
    })

    component.mount(container)
    const firstDiv = container.querySelector('div')
    expect(firstDiv?.textContent).toBe('Case A')

    setValue('b')

    await awaitMicrotask()
    expect(firstDiv?.isConnected).toBe(false)
    const secondDiv = container.querySelector('div')
    expect(secondDiv?.textContent).toBe('Case B')
  })

  it('should unmount properly', async () => {
    const [value] = state('a')
    const component = Switch({
      on: value,
      cases: [
        { when: 'a', children: createTextComponent('Case A') }
      ]
    })

    const cleanup = component.mount(container)
    expect(container.textContent).toBe('Case A')

    cleanup()
    expect(container.textContent).toBe('')
  })

  it('should handle numeric values', async () => {
    const [value, setValue] = state(1)
    const component = Switch({
      on: value,
      cases: [
        { when: 1, children: createTextComponent('One') },
        { when: 2, children: createTextComponent('Two') },
        { when: 3, children: createTextComponent('Three') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('One')

    setValue(3)

    await awaitMicrotask()
    expect(container.textContent).toBe('Three')
  })

  it('should handle boolean values', async () => {
    const [value, setValue] = state(true)
    const component = Switch({
      on: value,
      cases: [
        { when: true, children: createTextComponent('True') },
        { when: false, children: createTextComponent('False') }
      ]
    })

    component.mount(container)
    expect(container.textContent).toBe('True')

    setValue(false)

    await awaitMicrotask()
    expect(container.textContent).toBe('False')
  })
})
