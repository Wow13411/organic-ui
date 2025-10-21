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
  cleanup: () => void
  marker: Comment  // DOM marker node to track position
}

export function For<T, K = T>({ each, children, key, fallback }: ForProps<T, K>): Renderable {
  return {
    mount(parent: HTMLElement) {
      let currentItems: KeyedItem<T>[] = []
      let fallbackRenderable: Renderable | null = null
      let fallbackCleanup: (() => void) | null = null

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          const items = each()

          // Handle empty list with fallback
          if (items.length === 0) {
            // Unmount all current items
            for (const { cleanup } of currentItems) {
              cleanup()
            }
            currentItems = []

            // Mount fallback if provided
            if (fallback && !fallbackRenderable) {
              fallbackRenderable = fallback
              fallbackCleanup = fallbackRenderable.mount(parent)
            }
            return
          }

          // Unmount fallback if it was showing
          if (fallbackCleanup) {
            fallbackCleanup()
            fallbackCleanup = null
            fallbackRenderable = null
          }

          if (key) {
            // Optimized keyed reconciliation with minimal DOM operations
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
                // Create new renderable with marker
                const marker = document.createComment(`item-${String(itemKey)}`)
                const renderable = children(item, i)
                // Will be mounted later, cleanup will be set then
                newItems.push({ key: itemKey, item, renderable, marker, cleanup: () => {} })
              }
            }

            // Unmount items that are no longer in the list
            for (const oldItem of oldItemsSet) {
              oldItem.cleanup()
              oldItem.marker.remove()
            }

            // Reorder DOM nodes efficiently using markers
            // Only move nodes that are out of order
            let previousMarker: Comment | null = null
            
            for (const newItem of newItems) {
              const { marker, renderable } = newItem
              
              // Check if marker is already in the correct position
              if (previousMarker) {
                // Find the insertion point: after previous item's content
                // Skip past previous marker and its content to find next marker or end
                let insertionPoint: Node | null = previousMarker.nextSibling
                while (insertionPoint && !(insertionPoint instanceof Comment)) {
                  insertionPoint = insertionPoint.nextSibling
                }
                
                if (insertionPoint !== marker) {
                  // Marker is out of order - need to move it
                  if (!marker.parentNode) {
                    // New item - mount it
                    const tempContainer = document.createElement('div')
                    newItem.cleanup = renderable.mount(tempContainer)
                    
                    // Insert marker first, then content
                    parent.insertBefore(marker, insertionPoint)
                    while (tempContainer.firstChild) {
                      parent.insertBefore(tempContainer.firstChild, insertionPoint)
                    }
                  } else {
                    // Existing item - move it
                    // Marker is BEFORE content, collect from marker forward
                    const nodesToMove: Node[] = []
                    let current: Node | null = marker
                    
                    // Collect all nodes until next marker or end
                    while (current && !(current instanceof Comment && current !== marker)) {
                      nodesToMove.push(current)
                      current = current.nextSibling
                      if (current instanceof Comment) break
                    }
                    
                    // Move all collected nodes
                    for (const node of nodesToMove) {
                      parent.insertBefore(node, insertionPoint)
                    }
                  }
                }
              } else {
                // First item
                if (!marker.parentNode) {
                  // New item - mount at beginning
                  const tempContainer = document.createElement('div')
                  newItem.cleanup = renderable.mount(tempContainer)
                  
                  // Insert marker first, then content
                  parent.insertBefore(marker, parent.firstChild)
                  while (tempContainer.firstChild) {
                    parent.insertBefore(tempContainer.firstChild, marker.nextSibling)
                  }
                }
              }
              
              previousMarker = marker
            }

            currentItems = newItems
          } else {
            // Non-keyed: simple replace all
            for (const { cleanup, marker } of currentItems) {
              cleanup()
              marker.remove()
            }

            currentItems = items.map((item, index) => {
              const marker = document.createComment(`item-${index}`)
              const renderable = children(item, index)
              parent.appendChild(marker)
              const cleanup = renderable.mount(parent)
              return { key: index, item, renderable, marker, cleanup }
            })
          }
        })
      })

      const rootDispose = root.dispose

      return () => {
        // Dispose the effect
        if (rootDispose) rootDispose()

        // Unmount fallback if showing
        if (fallbackCleanup) {
          fallbackCleanup()
          fallbackCleanup = null
          fallbackRenderable = null
        }

        // Unmount all current items and remove markers
        for (const { cleanup, marker } of currentItems) {
          cleanup()
          marker.remove()
        }
        currentItems = []
      }
    }
  }
}
