import type { Renderable } from "../types.js"

interface DivProps {
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration>
  className?: string
  text?: string
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

      // Apply class and inline styles
      if (className) el.className = className
      Object.assign(el.style, style)

      // Set text content if provided
      if (text) el.textContent = text

      // Add click handler if provided
      if (onClick) el.onclick = onClick

      // Set id if provided
      if (id) el.id = id

      // Mount child components
      for (const child of children) {
        child.mount(el)
      }

      parent.appendChild(el)

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