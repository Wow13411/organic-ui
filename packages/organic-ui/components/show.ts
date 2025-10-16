import { effect, createRoot } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface ShowProps {
  when: () => boolean
  children: Renderable | (() => Renderable)
  fallback?: Renderable | (() => Renderable)
}

export function Show({ when, children, fallback }: ShowProps): Renderable {
  let container: HTMLElement
  let currentRenderable: Renderable | null = null
  let rootDispose: (() => void) | undefined

  const getRenderable = (value: Renderable | (() => Renderable)): Renderable => {
    return typeof value === "function" ? value() : value
  }

  return {
    mount(parent: HTMLElement) {
      container = parent

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          // Unmount current renderable
          if (currentRenderable) {
            currentRenderable.unmount?.()
            currentRenderable = null
          }

          // Mount new renderable based on condition
          if (when()) {
            currentRenderable = getRenderable(children)
          } else if (fallback) {
            currentRenderable = getRenderable(fallback)
          }

          if (currentRenderable) {
            currentRenderable.mount(container)
          }
        })
      })

      rootDispose = root.dispose
    },
    unmount() {
      // Dispose the effect
      if (rootDispose) rootDispose()

      // Unmount current renderable
      if (currentRenderable) {
        currentRenderable.unmount?.()
        currentRenderable = null
      }
    }
  }
}
