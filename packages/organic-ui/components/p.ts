import { effect, createRoot } from "../reactivity.js"

interface PProps {
  text: () => string
  style?: Partial<CSSStyleDeclaration>
  className?: string
}

export function p({ text, style, className }: PProps) {
  let el: HTMLParagraphElement
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("p")
      
      if (className) el.className = className
      if (style) Object.assign(el.style, style)
      
      parent.appendChild(el)

      // Create a root scope for the effect
      const root = createRoot(() => {
        effect(() => {
          el.textContent = text()
        })
      })

      rootDispose = root.dispose
    },
    unmount() {
      if (rootDispose) rootDispose()
      el.remove()
    }
  }
}
