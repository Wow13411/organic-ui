import { createRoot } from "../reactivity.js"
import { bind } from "../utils/bind.js"

type PProps = {
  text: string | (() => string)
} & Partial<{
  style: Partial<CSSStyleDeclaration>
  class: string
}>

export function p({ text, style, class: className }: PProps) {
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
        bind(text, (value) => {
          el.textContent = value
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
