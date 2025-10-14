import { effect } from "../reactivity.js"
import type { Renderable } from "../types.js"

interface DivProps {
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
  text?: string | (() => string)
  onClick?: () => void
  id?: string
  ref?: (el: HTMLDivElement) => void | (() => void)
}

export function div({ children = [], style, className, text, onClick, id, ref }: DivProps) {
  let el: HTMLDivElement
  let cleanup: (() => void) | void

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("div")

      // Add click handler if provided
      if (onClick) el.onclick = onClick

      // Set id if provided
      if (id) el.id = id

      // Mount child components
      for (const child of children) {
        child.mount(el)
      }

      parent.appendChild(el)

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

      // Call ref callback after mounting
      if (ref) cleanup = ref(el)
    },
    unmount() {
      // Call cleanup if provided
      if (cleanup) cleanup()
      for (const child of children) child.unmount?.()
      el.remove()
    }
  }
}