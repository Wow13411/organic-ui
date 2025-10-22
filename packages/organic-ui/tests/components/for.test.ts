import { describe, it, expect, beforeEach } from 'vitest'
import { For } from '../../src/components/for.js'
import { state } from '../../src/reactivity.js'
import type { Renderable } from '../../src/types.js'
import { awaitMicrotask, awaitMicrotasks } from '../test-utils.js'

describe('For component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  const createTextComponent = (text: string): Renderable => ({
    mount(parent: HTMLElement) {
      const el = document.createElement('div')
      el.textContent = text
      el.dataset.text = text
      parent.appendChild(el)
      return () => el.remove()
    }
  })

  it('should render list of items', async () => {
    const [items] = state(['a', 'b', 'c'])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item)
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(3)
    expect(divs[0].textContent).toBe('a')
    expect(divs[1].textContent).toBe('b')
    expect(divs[2].textContent).toBe('c')
  })

  it('should render empty list', async () => {
    const [items] = state<string[]>([])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item)
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(0)
  })

  it('should show fallback when list is empty', async () => {
    const [items] = state<string[]>([])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item),
      fallback: createTextComponent('Empty')
    })

    component.mount(container)
    expect(container.textContent).toBe('Empty')
  })

  it('should update when items change (non-keyed)', async () => {
    const [items, setItems] = state(['a', 'b'])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item)
    })

    component.mount(container)
    let divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)

    setItems(['x', 'y', 'z'])

    await awaitMicrotask()
    divs = container.querySelectorAll('div')
    expect(divs.length).toBe(3)
    expect(divs[0].textContent).toBe('x')
    expect(divs[1].textContent).toBe('y')
    expect(divs[2].textContent).toBe('z')
  })

  it('should toggle between items and fallback', async () => {
    const [items, setItems] = state(['a'])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item),
      fallback: createTextComponent('Empty')
    })

    component.mount(container)
    expect(container.querySelector('div')?.textContent).toBe('a')

    setItems([])

    await awaitMicrotask()
    expect(container.textContent).toBe('Empty')

    setItems(['b', 'c'])
    await awaitMicrotask()
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)
    expect(divs[0].textContent).toBe('b')
    expect(divs[1].textContent).toBe('c')
  })

  it.skip('should use key function for keyed reconciliation', async () => {
    // TODO: Known issue - simple keyed reconciliation with reordering needs investigation
    const [items, setItems] = state([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])

    const component = For({
      each: items,
      children: (item) => createTextComponent(item.name),
      key: (item) => item.id
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)
    expect(divs[0].textContent).toBe('Alice')
    expect(divs[1].textContent).toBe('Bob')

    // Store reference to DOM nodes
    const aliceNode = divs[0]
    const bobNode = divs[1]

    // Reverse the order
    setItems([
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' }
    ])

    await awaitMicrotask()
    const newDivs = container.querySelectorAll('div')
    expect(newDivs.length).toBe(2)
    expect(newDivs[0].textContent).toBe('Bob')
    expect(newDivs[1].textContent).toBe('Alice')

    // With keyed reconciliation, the DOM nodes should be reused
    expect(newDivs[0]).toBe(bobNode)
    expect(newDivs[1]).toBe(aliceNode)
  })

  it('should add items with keyed reconciliation', async () => {
    const [items, setItems] = state([
      { id: 1, name: 'Alice' }
    ])

    const component = For({
      each: items,
      children: (item) => createTextComponent(item.name),
      key: (item) => item.id
    })

    component.mount(container)
    let divs = container.querySelectorAll('div')
    expect(divs.length).toBe(1)

    const aliceNode = divs[0]

    setItems([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])

    await awaitMicrotask()
    divs = container.querySelectorAll('div')
    expect(divs.length).toBe(2)
    expect(divs[0].textContent).toBe('Alice')
    expect(divs[1].textContent).toBe('Bob')

    // Alice's node should be reused
    expect(divs[0]).toBe(aliceNode)
  })

  it('should remove items with keyed reconciliation', async () => {
    const [items, setItems] = state([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ])

    const component = For({
      each: items,
      children: (item) => createTextComponent(item.name),
      key: (item) => item.id
    })

    component.mount(container)
    let divs = container.querySelectorAll('div')
    expect(divs.length).toBe(3)

    const bobNode = divs[1]

    // Remove Alice and Charlie, keep Bob
    setItems([
      { id: 2, name: 'Bob' }
    ])

    await awaitMicrotask()
    divs = container.querySelectorAll('div')
    expect(divs.length).toBe(1)
    expect(divs[0].textContent).toBe('Bob')

    // Bob's node should be reused
    expect(divs[0]).toBe(bobNode)
  })

  it.skip('should handle complex reordering with keyed reconciliation', async () => {
    // TODO: Known issue - complex keyed reconciliation with reordering needs investigation
    const [items, setItems] = state([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' }
    ])

    const component = For({
      each: items,
      children: (item) => createTextComponent(item.name),
      key: (item) => item.id
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')

    const nodes = {
      1: divs[0],
      2: divs[1],
      3: divs[2],
      4: divs[3]
    }

    // Reorder: D, B, A, C
    setItems([
      { id: 4, name: 'D' },
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
      { id: 3, name: 'C' }
    ])

    await awaitMicrotask()
    // Wait an extra tick for DOM operations to complete
    await awaitMicrotask()
    const newDivs = container.querySelectorAll('div')
    expect(newDivs.length).toBe(4)
    expect(newDivs[0].textContent).toBe('D')
    expect(newDivs[1].textContent).toBe('B')
    expect(newDivs[2].textContent).toBe('A')
    expect(newDivs[3].textContent).toBe('C')

    // All nodes should be reused
    expect(newDivs[0]).toBe(nodes[4])
    expect(newDivs[1]).toBe(nodes[2])
    expect(newDivs[2]).toBe(nodes[1])
    expect(newDivs[3]).toBe(nodes[3])
  })

  it('should pass index to children function', async () => {
    const [items] = state(['a', 'b', 'c'])
    const component = For({
      each: items,
      children: (item, index) => createTextComponent(`${index}: ${item}`)
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs[0].textContent).toBe('0: a')
    expect(divs[1].textContent).toBe('1: b')
    expect(divs[2].textContent).toBe('2: c')
  })

  it('should pass index to key function', async () => {
    const [items] = state(['a', 'b', 'c'])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item),
      key: (item, index) => `${item}-${index}`
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBe(3)
  })

  it('should unmount properly', async () => {
    const [items] = state(['a', 'b'])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item)
    })

    const cleanup = component.mount(container)
    expect(container.querySelectorAll('div').length).toBe(2)

    cleanup()
    expect(container.querySelectorAll('div').length).toBe(0)
  })

  it('should unmount fallback on cleanup', async () => {
    const [items] = state<string[]>([])
    const component = For({
      each: items,
      children: (item) => createTextComponent(item),
      fallback: createTextComponent('Empty')
    })

    const cleanup = component.mount(container)
    expect(container.textContent).toBe('Empty')

    cleanup()
    expect(container.textContent).toBe('')
  })

  it.skip('should handle mixed add/remove/reorder operations', async () => {
    // TODO: Known issue - complex keyed reconciliation with mixed operations needs investigation
    const [items, setItems] = state([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' }
    ])

    const component = For({
      each: items,
      children: (item) => createTextComponent(item.name),
      key: (item) => item.id
    })

    component.mount(container)
    const divs = container.querySelectorAll('div')
    const nodeB = divs[1]

    // Remove A, keep B (reordered to end), add D and E
    setItems([
      { id: 4, name: 'D' },
      { id: 5, name: 'E' },
      { id: 2, name: 'B' }
    ])

    await awaitMicrotask()
    // Wait an extra tick for DOM operations to complete
    await awaitMicrotask()
    const newDivs = container.querySelectorAll('div')
    expect(newDivs.length).toBe(3)
    expect(newDivs[0].textContent).toBe('D')
    expect(newDivs[1].textContent).toBe('E')
    expect(newDivs[2].textContent).toBe('B')

    // B's node should be reused
    expect(newDivs[2]).toBe(nodeB)
  })
})
