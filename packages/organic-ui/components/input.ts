import { createRoot } from "../reactivity.js"
import { bind, bindAssign } from "../utils/bind.js"
import type { Renderable } from "../types.js"

interface InputProps {
  type?: string
  value?: string | number | (() => string | number)
  onInput?: (value: string) => void
  onChange?: (value: string) => void
  placeholder?: string
  min?: string | number
  max?: string | number
  step?: string | number
  style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>)
  className?: string | (() => string)
  id?: string
  ref?: (el: HTMLInputElement) => void | (() => void)
}

export function input({ 
  type = "text", 
  value, 
  onInput, 
  onChange,
  placeholder,
  min,
  max,
  step,
  style, 
  className, 
  id,
  ref 
}: InputProps): Renderable {
  let el: HTMLInputElement
  let cleanup: (() => void) | void
  let rootDispose: (() => void) | undefined

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("input")
      el.type = type

      if (placeholder) el.placeholder = placeholder
      if (min !== undefined) el.min = String(min)
      if (max !== undefined) el.max = String(max)
      if (step !== undefined) el.step = String(step)
      if (id) el.id = id

      // Event handlers
      if (onInput) {
        el.oninput = (e) => onInput((e.target as HTMLInputElement).value)
      }
      if (onChange) {
        el.onchange = (e) => onChange((e.target as HTMLInputElement).value)
      }

      parent.appendChild(el)

      // Create a root scope for all reactive effects
      const root = createRoot(() => {
        // Reactive or static value
        if (value != null) {
          bind(value, (val) => {
            el.value = String(val)
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
      if (rootDispose) rootDispose()
      if (cleanup) cleanup()
      el.remove()
    }
  }
}
