import { effect, createRoot } from "../reactivity.js"
import { bind, bindAssign } from "../utils/bind.js"
import type { Renderable } from "../types.js"

interface AnchorProps {
  href: string | (() => string)
  text?: string | (() => string)
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
  onClick?: (e: MouseEvent) => void
  target?: string
  rel?: string
}

export function a({ href, text, children = [], style, className, onClick, target, rel }: AnchorProps) {
  let el: HTMLAnchorElement
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("a")

      // Set target and rel attributes
      if (target) el.target = target
      if (rel) el.rel = rel

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

        // Reactive or static className
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

      rootDispose = root.dispose

      // Click handler
      if (onClick) {
        el.onclick = onClick
      }

      // Mount children
      for (const child of children) {
        child.mount(el)
      }

      parent.appendChild(el)
    },
    unmount() {
      if (rootDispose) rootDispose()
      for (const child of children) child.unmount?.()
      el.remove()
    }
  }
}
