import { createRoot } from "../reactivity.js"
import { bind, bindAssign } from "../utils/bind.js"
import type { Renderable } from "../types.js"

type DivProps = Partial<{
  style: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  class: string | (() => string)
  onClick: () => void
  id: string
  ref: (el: HTMLDivElement) => void | (() => void)
}> & (
  | { text: string | (() => string); children?: never }
  | { text?: never; children: Renderable[] }
  | { text?: never; children?: never }
)

export function div({ children = [], style, class: className, text, onClick, id, ref }: DivProps) {
  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("div")
      
      // Add click handler if provided
      if (onClick) el.onclick = onClick

      // Set id if provided
      if (id) el.id = id

      // Mount child components
      const childCleanups = children.map(child => child.mount(el))

      parent.appendChild(el)
      
      // Create a root scope for all reactive effects in this component
      let cleanup: (() => void) | void
      const root = createRoot(() => {
        // Reactive or static text
        if (text != null) {
          bind(text, (value) => {
            el.textContent = value
          })
        }

        // Reactive or static class
        if (className != null) {
          bind(className, (value) => {
            el.className = value
          })
        }

        // Reactive or static style
        if (style != null) {
          bindAssign(style, el.style)
        }

        // Call ref callback after mounting
        if (ref) cleanup = ref(el)
      })
      
      const rootDispose = root.dispose

      return () => {
        // Dispose all effects created in this component
        if (rootDispose) rootDispose()
        
        // Call ref cleanup if provided
        if (cleanup) cleanup()
        
        // Unmount children
        childCleanups.forEach(cleanup => cleanup())
        
        // Remove element
        el.remove()
      }
    }
  }
}