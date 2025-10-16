import { effect, createRoot } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface ForProps<T, K = T> {
  each: () => T[]
  children: (item: T, index: number) => Renderable
  key?: (item: T, index: number) => K
  fallback?: Renderable
}

interface KeyedItem<T> {
  key: unknown
  item: T
  renderable: Renderable
}

export function For<T, K = T>({ each, children, key, fallback }: ForProps<T, K>): Renderable {
  let container: HTMLElement
  let currentItems: KeyedItem<T>[] = []
  let fallbackRenderable: Renderable | null = null
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      container = parent

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          const items = each()

          // Handle empty list with fallback
          if (items.length === 0) {
            // Unmount all current items
            for (const { renderable } of currentItems) {
              renderable.unmount?.()
            }
            currentItems = []

            // Mount fallback if provided
            if (fallback && !fallbackRenderable) {
              fallbackRenderable = fallback
              fallbackRenderable.mount(container)
            }
            return
          }

          // Unmount fallback if it was showing
          if (fallbackRenderable) {
            fallbackRenderable.unmount?.()
            fallbackRenderable = null
          }

          if (key) {
            // Keyed reconciliation - reuse DOM nodes when keys match
            const newItems: KeyedItem<T>[] = []
            const oldItemsByKey = new Map<unknown, KeyedItem<T>>()
            const oldItemsSet = new Set(currentItems)

            // Build map of old items by key
            for (const oldItem of currentItems) {
              oldItemsByKey.set(oldItem.key, oldItem)
            }

            // Process new items and determine what to reuse vs create
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              const itemKey = key(item, i)
              const existing = oldItemsByKey.get(itemKey)

              if (existing) {
                // Reuse existing renderable (keeps DOM node alive)
                newItems.push(existing)
                oldItemsSet.delete(existing) // Mark as reused
              } else {
                // Create new renderable
                const renderable = children(item, i)
                newItems.push({ key: itemKey, item, renderable })
              }
            }

            // Unmount items that are no longer in the list
            for (const oldItem of oldItemsSet) {
              oldItem.renderable.unmount?.()
            }

            // Clear container and remount all in correct order
            // This is simple but not optimal - a production implementation
            // would use insertBefore to minimize DOM operations
            container.innerHTML = ''
            for (const { renderable } of newItems) {
              renderable.mount(container)
            }

            currentItems = newItems
          } else {
            // Non-keyed: simple replace all
            for (const { renderable } of currentItems) {
              renderable.unmount?.()
            }

            currentItems = items.map((item, index) => ({
              key: index,
              item,
              renderable: children(item, index)
            }))

            for (const { renderable } of currentItems) {
              renderable.mount(container)
            }
          }
        })
      })

      rootDispose = root.dispose
    },
    unmount() {
      // Dispose the effect
      if (rootDispose) rootDispose()

      // Unmount fallback if showing
      if (fallbackRenderable) {
        fallbackRenderable.unmount?.()
        fallbackRenderable = null
      }

      // Unmount all current items
      for (const { renderable } of currentItems) {
        renderable.unmount?.()
      }
      currentItems = []
    }
  }
}
