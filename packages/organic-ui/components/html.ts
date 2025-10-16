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
  let elements: Node[] = []
  let marker: Comment | null = null

  return {
    mount(parent: HTMLElement) {
      // Create a marker comment node to track insertion position
      marker = document.createComment("html-marker")
      parent.appendChild(marker)

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
        
        // Remove old elements
        elements.forEach(el => el.parentNode?.removeChild(el))
        elements = []
        
        // Create a temporary container to parse HTML
        const temp = document.createElement("template")
        temp.innerHTML = htmlContent
        
        // Move all nodes from template to parent before the marker
        const fragment = temp.content
        elements = Array.from(fragment.childNodes)
        
        // Insert all nodes before the marker to maintain position
        if (marker && marker.parentNode) {
          marker.parentNode.insertBefore(fragment, marker)
        }
      })
    },
    unmount() {
      elements.forEach(el => el.parentNode?.removeChild(el))
      elements = []
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker)
      }
      marker = null
    }
  }
}
