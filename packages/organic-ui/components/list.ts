import type { Renderable } from "../types.js"

interface ListProps {
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration>
  className?: string
}

export function ul({ children = [], style, className }: ListProps) {
  let el: HTMLUListElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("ul")

      if (className) el.className = className
      Object.assign(el.style, style)

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

interface ListItemProps {
  text?: string | (() => string)
  style?: Partial<CSSStyleDeclaration>
  className?: string
  onClick?: () => void
}

export function li({ text, style, className, onClick }: ListItemProps) {
  let el: HTMLLIElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("li")

      if (className) el.className = className
      Object.assign(el.style, style)

      if (onClick) el.onclick = onClick

      parent.appendChild(el)

      // Handle reactive text
      if (typeof text === "function") {
        import("../reactivity.js").then(({ effect }) => {
          effect(() => {
            el.textContent = text()
          })
        })
      } else if (text) {
        el.textContent = text
      }
    },
    unmount() {
      el.remove()
    }
  }
}
