import { effect, createRoot } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface ShowProps {
  when: () => boolean
  children: Renderable | (() => Renderable)
  fallback?: Renderable | (() => Renderable)
}

export function Show({ when, children, fallback }: ShowProps): Renderable {
  const getRenderable = (value: Renderable | (() => Renderable)): Renderable => {
    return typeof value === "function" ? value() : value
  }

  return {
    mount(parent: HTMLElement) {
      let currentRenderable: Renderable | null = null
      let currentCleanup: (() => void) | null = null

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          // Unmount current renderable
          if (currentCleanup) {
            currentCleanup()
            currentCleanup = null
            currentRenderable = null
          }

          // Mount new renderable based on condition
          if (when()) {
            currentRenderable = getRenderable(children)
          } else if (fallback) {
            currentRenderable = getRenderable(fallback)
          }

          if (currentRenderable) {
            currentCleanup = currentRenderable.mount(parent)
          }
        })
      })

      const rootDispose = root.dispose

      return () => {
        // Dispose the effect
        if (rootDispose) rootDispose()

        // Unmount current renderable
        if (currentCleanup) {
          currentCleanup()
          currentCleanup = null
          currentRenderable = null
        }
      }
    }
  }
}
