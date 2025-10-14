import { effect } from "../reactivity.js"
import type { Renderable } from "../types.js"

type HtmlValue = string | number | (() => string | number)

/**
 * Tagged template function for rendering raw HTML content.
 * Supports both static and dynamic (reactive) content.
 * 
 * @example
 * // Static HTML
 * html`<p>Hello World</p>`
 * 
 * @example
 * // Dynamic HTML with reactive state
 * const [count, setCount] = state(0)
 * html`<p>Count: ${count}</p>`
 */
export function html(strings: TemplateStringsArray, ...values: HtmlValue[]): Renderable {
  let el: HTMLElement

  return {
    mount(parent: HTMLElement) {
      // Create a wrapper element to hold the HTML content
      el = document.createElement("div")
      
      // Use effect to handle reactive updates
      effect(() => {
        // Interpolate the template strings with values
        let htmlContent = strings[0]
        
        for (let i = 0; i < values.length; i++) {
          const value = values[i]
          // If value is a function (reactive getter), call it
          const resolvedValue = typeof value === "function" ? value() : value
          htmlContent += resolvedValue + strings[i + 1]
        }
        
        // Set the innerHTML
        el.innerHTML = htmlContent
      })
      
      parent.appendChild(el)
    },
    unmount() {
      el.remove()
    }
  }
}
