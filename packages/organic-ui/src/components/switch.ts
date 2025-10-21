import { effect, createRoot } from "../reactivity.js"
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
  return {
    mount(parent: HTMLElement) {
      let currentRenderables: Renderable[] = []
      let currentCleanups: (() => void)[] = []

      const mountRenderables = (renderables: Renderable[]) => {
        currentCleanups = renderables.map(renderable => renderable.mount(parent))
      }

      const unmountRenderables = () => {
        currentCleanups.forEach(cleanup => cleanup())
        currentCleanups = []
        currentRenderables = []
      }

      // Create a root scope for the effect
      const root = createRoot(() => {
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
      })

      const rootDispose = root.dispose

      return () => {
        // Dispose the effect
        if (rootDispose) rootDispose()

        // Unmount current renderables
        unmountRenderables()
      }
    }
  }
}
