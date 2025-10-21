import type { Renderable } from "../types.js"

type ImgProps = {
  src: string
} & Partial<{
  alt: string
  style: Partial<CSSStyleDeclaration>
  class: string
  width: string | number
  height: string | number
  onClick: () => void
  ref: (el: HTMLImageElement) => void | (() => void)
}>

export function img({ src, alt = "", style, class: className, width, height, onClick, ref }: ImgProps): Renderable {
  return {
    mount(parent: HTMLElement) {
      const el = document.createElement("img")

      // Set source and alt
      el.src = src
      el.alt = alt

      // Apply class and inline styles
      if (className) el.className = className
      if (style) Object.assign(el.style, style)

      // Set dimensions if provided
      if (width !== undefined) {
        el.width = typeof width === "number" ? width : parseInt(width)
      }
      if (height !== undefined) {
        el.height = typeof height === "number" ? height : parseInt(height)
      }

      // Add click handler if provided
      if (onClick) el.onclick = onClick

      parent.appendChild(el)

      // Call ref callback after mounting
      const cleanup = ref ? ref(el) : undefined

      return () => {
        // Call cleanup if provided
        if (cleanup) cleanup()
        el.remove()
      }
    }
  }
}
