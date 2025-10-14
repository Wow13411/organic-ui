import type { Renderable } from "./types.js"

export function render(App: () => Renderable[], container: HTMLElement) {
  const renderables = App()
  for (const r of renderables) r.mount(container)
}