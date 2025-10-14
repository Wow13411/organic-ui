import { effect } from "../reactivity.js";

export function button({ text, onClick }: { text: () => string; onClick: () => void }) {
  let el: HTMLButtonElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("button")
      parent.appendChild(el)

      effect(() => {
        el.textContent = text()
      })

      el.onclick = onClick
    },
    unmount() {
      el.remove()
    }
  }
}
