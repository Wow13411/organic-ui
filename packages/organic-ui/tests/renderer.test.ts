import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '../src/renderer.js'
import type { Renderable } from '../src/types.js'

describe('Renderer', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should render a simple component', () => {
    const component = (): Renderable => ({
      mount(parent: HTMLElement) {
        const el = document.createElement('div')
        el.textContent = 'Hello World'
        parent.appendChild(el)
        return () => el.remove()
      }
    })

    render(component, container)
    expect(container.textContent).toBe('Hello World')
  })

  it('should return unmount function', () => {
    const component = (): Renderable => ({
      mount(parent: HTMLElement) {
        const el = document.createElement('div')
        el.textContent = 'Test'
        parent.appendChild(el)
        return () => el.remove()
      }
    })

    const unmount = render(component, container)
    expect(container.textContent).toBe('Test')

    unmount()
    expect(container.textContent).toBe('')
  })

  it('should unmount component properly', () => {
    const component = (): Renderable => ({
      mount(parent: HTMLElement) {
        const el = document.createElement('div')
        el.id = 'test-element'
        parent.appendChild(el)
        return () => el.remove()
      }
    })

    const unmount = render(component, container)
    expect(container.querySelector('#test-element')).toBeTruthy()

    unmount()
    expect(container.querySelector('#test-element')).toBeNull()
  })

  it('should render component with multiple children', () => {
    const component = (): Renderable => ({
      mount(parent: HTMLElement) {
        const div = document.createElement('div')

        const child1 = document.createElement('span')
        child1.textContent = 'First'

        const child2 = document.createElement('span')
        child2.textContent = 'Second'

        div.appendChild(child1)
        div.appendChild(child2)
        parent.appendChild(div)

        return () => div.remove()
      }
    })

    render(component, container)
    const spans = container.querySelectorAll('span')
    expect(spans.length).toBe(2)
    expect(spans[0].textContent).toBe('First')
    expect(spans[1].textContent).toBe('Second')
  })
})
