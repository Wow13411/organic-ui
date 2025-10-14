import { effect } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface SwitchCase<T> {
  when: T
  children: Renderable | Renderable[]
}

interface SwitchProps<T> {
  on: () => T
  matcher?: (onValue: T, matchValue: T) => boolean
  cases: SwitchCase<T>[]
  fallback?: Renderable | Renderable[]
}

export function Switch<T>({ on, matcher = (a, b) => a === b, cases, fallback }: SwitchProps<T>): Renderable {
  let container: HTMLElement
  let currentRenderables: Renderable[] = []

  const mountRenderables = (renderables: Renderable[]) => {
    for (const renderable of renderables) {
      renderable.mount(container)
    }
  }

  const unmountRenderables = () => {
    for (const renderable of currentRenderables) {
      renderable.unmount?.()
    }
    currentRenderables = []
  }

  return {
    mount(parent: HTMLElement) {
      container = parent

      effect(() => {
        // Unmount current renderables
        unmountRenderables()

        const onValue = on()
        
        // Find matching case
        for (const caseItem of cases) {
          if (matcher(onValue, caseItem.when)) {
            currentRenderables = Array.isArray(caseItem.children) 
              ? caseItem.children 
              : [caseItem.children]
            mountRenderables(currentRenderables)
            return
          }
        }
        
        // Use fallback if no match
        if (fallback) {
          currentRenderables = Array.isArray(fallback) ? fallback : [fallback]
          mountRenderables(currentRenderables)
        }
      })
    },
    unmount() {
      unmountRenderables()
    }
  }
}
