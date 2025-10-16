import { effect, createRoot } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface ForProps<T> {
  each: () => T[]
  children: (item: T, index: number) => Renderable
}

export function For<T>({ each, children }: ForProps<T>): Renderable {
  let container: HTMLElement
  let currentRenderables: Renderable[] = []
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      container = parent

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          // Unmount old renderables
          for (const renderable of currentRenderables) {
            renderable.unmount?.()
          }
          currentRenderables = []

          // Create and mount new renderables
          const items = each()
          currentRenderables = items.map((item, index) => children(item, index))
          
          for (const renderable of currentRenderables) {
            renderable.mount(container)
          }
        })
      })
      
      rootDispose = root.dispose
    },
    unmount() {
      // Dispose the effect
      if (rootDispose) rootDispose()
      
      // Unmount all current renderables
      for (const renderable of currentRenderables) {
        renderable.unmount?.()
      }
      currentRenderables = []
    }
  }
}
