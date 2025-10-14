import type { Renderable } from "../types.js"

interface DivProps {
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration>
  className?: string
}

export function div({ children = [], style, className }: DivProps) {
  let el: HTMLDivElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("div")

      // Apply class and inline styles
      if (className) el.className = className
      Object.assign(el.style, style)

      // Mount child components
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