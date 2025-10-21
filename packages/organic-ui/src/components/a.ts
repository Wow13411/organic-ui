import { createRoot } from "../reactivity.js"
import { bind, bindAssign } from "../utils/bind.js"
import type { Renderable } from "../types.js"

type AnchorProps = {
  href: string | (() => string)
} & Partial<{
  style: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  class: string | (() => string)
  onClick: (e: MouseEvent) => void
  target: string
  rel: string
}> & (
  | { text: string | (() => string); children?: never }
  | { text?: never; children: Renderable[] }
  | { text?: never; children?: never }
)

export function a({ href, text, children = [], style, class: className, onClick, target, rel }: AnchorProps) {
  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("a")

      // Set target and rel attributes
      if (target) el.target = target
      if (rel) el.rel = rel

      // Click handler
      if (onClick) {
        el.onclick = onClick
      }

      // Mount children
      const childCleanups = children.map(child => child.mount(el))

      parent.appendChild(el)

      // Create a root scope for all reactive effects
      const root = createRoot(() => {
        // Reactive or static href
        bind(href, (value) => {
          el.href = value
        })

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
      })

      const rootDispose = root.dispose

      return () => {
        if (rootDispose) rootDispose()
        childCleanups.forEach(cleanup => cleanup())
        el.remove()
      }
    }
  }
}
