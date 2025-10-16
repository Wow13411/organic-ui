import { effect, createRoot } from "../reactivity.js";
import { bind, bindAssign } from "../utils/bind.js";

interface ButtonProps {
  text: () => string
  onClick: () => void
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
}

export function button({ text, onClick, style, className }: ButtonProps) {
  let el: HTMLButtonElement
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("button")
      el.onclick = onClick
      parent.appendChild(el)

      // Create a root scope for all reactive effects
      const root = createRoot(() => {
        // Reactive text
        effect(() => {
          el.textContent = text()
        })

        // Reactive or static className (explicit null check to allow empty strings)
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
    },
    unmount() {
      if (rootDispose) rootDispose()
      el.remove()
    }
  }
}
