import { createRoot } from "../reactivity.js"
import { bind } from "../utils/bind.js"
import type { Renderable } from "../types.js"

type ListProps = Partial<{
  children: Renderable[]
  style: Partial<CSSStyleDeclaration>
  class: string
}>

export function ul({ children = [], style, class: className }: ListProps) {
  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("ul")

      if (className) el.className = className
      if (style) Object.assign(el.style, style)

      const childCleanups = children.map(child => child.mount(el))

      parent.appendChild(el)

      return () => {
        childCleanups.forEach(cleanup => cleanup())
        el.remove()
      }
    }
  }
}

type ListItemProps = Partial<{
  text: string | (() => string)
  style: Partial<CSSStyleDeclaration>
  class: string
  onClick: () => void
}>

export function li({ text, style, class: className, onClick }: ListItemProps) {
  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("li")

      if (className) el.className = className
      if (style) Object.assign(el.style, style)

      if (onClick) el.onclick = onClick

      parent.appendChild(el)

      // Create a root scope for reactive text
      const root = createRoot(() => {
        if (text != null) {
          bind(text, (value) => {
            el.textContent = value
          })
        }
      })

      const rootDispose = root.dispose

      return () => {
        if (rootDispose) rootDispose()
        el.remove()
      }
    }
  }
}
