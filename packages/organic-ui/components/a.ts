import { effect, createRoot } from "../reactivity.js"
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
        if (typeof href === "function") {
          effect(() => {
            el.href = href()
          })
        } else {
          el.href = href
        }

        // Reactive or static text
        if (text) {
          if (typeof text === "function") {
            effect(() => {
              el.textContent = text()
            })
          } else {
            el.textContent = text
          }
        }

        // Reactive or static className
        if (className) {
          if (typeof className === "function") {
            effect(() => {
              el.className = className()
            })
          } else {
            el.className = className
          }
        }

        // Reactive or static style
        if (style) {
          if (typeof style === "function") {
            effect(() => {
              Object.assign(el.style, style())
            })
          } else {
            Object.assign(el.style, style)
          }
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
      for (const child of children) child.unmount?.()
      el.remove()
    }
  }
}
