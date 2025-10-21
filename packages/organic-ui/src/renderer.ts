import type { Renderable } from "./types.js"

export function render(component: () => Renderable, container: HTMLElement) {
  const renderable = component()
  return renderable.mount(container)  // Returns unmount function
}