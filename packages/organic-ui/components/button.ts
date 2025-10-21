import { effect, createRoot } from "../reactivity.js";
import { bind, bindAssign } from "../utils/bind.js";
import type { Renderable } from "../types.js"

interface ButtonProps {
  text?: string | (() => string)
  children?: Renderable[]
  onClick: () => void
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
}

export function button({ text, children = [], onClick, style, className }: ButtonProps) {
  let el: HTMLButtonElement
  let rootDispose: (() => void) | undefined
  
  // Filter out null/undefined children
  const validChildren = children.filter(child => child != null)

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("button")
      el.onclick = onClick
      
      // Mount child components if provided
      for (const child of validChildren) {
        child.mount(el)
      }
      
      parent.appendChild(el)

      // Create a root scope for all reactive effects
      const root = createRoot(() => {
        // Reactive or static text (only if no children and text is provided)
        if (text != null && validChildren.length === 0) {
          bind(text, (value) => {
            el.textContent = value
          })
        }

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
      
      // Unmount children
      for (const child of validChildren) {
        child.unmount?.()
      }
      
      el.remove()
    }
  }
}
