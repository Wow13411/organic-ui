import { effect } from "../reactivity.js"

interface PProps {
  text: () => string
  style?: Partial<CSSStyleDeclaration>
  className?: string
}

export function p({ text, style, className }: PProps) {
  let el: HTMLParagraphElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("p")
      
      if (className) el.className = className
      if (style) Object.assign(el.style, style)
      
      parent.appendChild(el)

      effect(() => {
        el.textContent = text()
      })
    },
    unmount() {
      el.remove()
    }
  }
}
