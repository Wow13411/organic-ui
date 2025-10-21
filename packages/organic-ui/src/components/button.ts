import { effect, createRoot } from "../reactivity.js";
import { bind, bindAssign } from "../utils/bind.js";
import type { Renderable } from "../types.js"

type ButtonProps = {
  onClick: () => void
} & Partial<{
  style: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  class: string | (() => string)
}> & (
  | { text: string | (() => string); children?: never }
  | { text?: never; children: Renderable[] }
  | { text?: never; children?: never }
)

export function button({ text, children = [], onClick, style, class: className }: ButtonProps) {
  // Filter out null/undefined children
  const validChildren = children.filter(child => child != null)

  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("button")
      el.onclick = onClick
      
      // Mount child components if provided
      const childCleanups = validChildren.map(child => child.mount(el))
      
      parent.appendChild(el)

      // Create a root scope for all reactive effects
      const root = createRoot(() => {
        // Reactive or static text (only if no children and text is provided)
        if (text != null && validChildren.length === 0) {
          bind(text, (value) => {
            el.textContent = value
          })
        }

        // Reactive or static class (explicit null check to allow empty strings)
        if (className != null) {
          bind(className, (value) => {
            el.className = value
          })
        }

        // Reactive or static style
        if (style != null) {
          bindAssign(style, el.style)
        }
      })

      const rootDispose = root.dispose

      return () => {
        if (rootDispose) rootDispose()
        
        // Unmount children
        childCleanups.forEach(cleanup => cleanup())
        
        el.remove()
      }
    }
  }
}
