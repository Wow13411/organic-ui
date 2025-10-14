import { effect } from "../reactivity.js";

interface ButtonProps {
  text: () => string
  onClick: () => void
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
}

export function button({ text, onClick, style, className }: ButtonProps) {
  let el: HTMLButtonElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("button")
      
      parent.appendChild(el)

      // Reactive text
      effect(() => {
        el.textContent = text()
      })

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

      el.onclick = onClick
    },
    unmount() {
      el.remove()
    }
  }
}
