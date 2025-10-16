import { effect, createRoot } from "../reactivity.js"
import { bind, bindAssign } from "../utils/bind.js"
import type { Renderable } from "../types.js"

interface DivProps {
  children?: Renderable[]
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
  text?: string | (() => string)
  onClick?: () => void
  id?: string
  ref?: (el: HTMLDivElement) => void | (() => void)
}

export function div({ children = [], style, className, text, onClick, id, ref }: DivProps) {
  let el: HTMLDivElement
  let cleanup: (() => void) | void
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("div")
      
      // Add click handler if provided
      if (onClick) el.onclick = onClick

      // Set id if provided
      if (id) el.id = id

      // Mount child components
      for (const child of children) {
        child.mount(el)
      }

      parent.appendChild(el)
      
      // Create a root scope for all reactive effects in this component
      const root = createRoot(() => {
        // Reactive or static text
        if (text != null) {
          bind(text, (value) => {
            el.textContent = value
          })
        }

        // Reactive or static className
        if (className != null) {
          bind(className, (value) => {
            el.className = value
          })
        }

        // Reactive or static style
        if (style != null) {
          bindAssign(style, el.style)
        }

        // Call ref callback after mounting
        if (ref) cleanup = ref(el)
      })
      
      rootDispose = root.dispose
    },
    unmount() {
      // Dispose all effects created in this component
      if (rootDispose) rootDispose()
      
      // Call ref cleanup if provided
      if (cleanup) cleanup()
      
      // Unmount children
      for (const child of children) child.unmount?.()
      
      // Remove element
      el.remove()
    }
  }
}