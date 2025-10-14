import { effect } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface ShowProps {
  when: () => boolean
  children: Renderable | (() => Renderable)
  fallback?: Renderable | (() => Renderable)
}

export function Show({ when, children, fallback }: ShowProps): Renderable {
  let container: HTMLElement
  let currentRenderable: Renderable | null = null

  const getRenderable = (value: Renderable | (() => Renderable)): Renderable => {
    return typeof value === "function" ? value() : value
  }

  return {
    mount(parent: HTMLElement) {
      container = parent

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
    },
    unmount() {
      if (currentRenderable) {
        currentRenderable.unmount?.()
        currentRenderable = null
      }
    }
  }
}
