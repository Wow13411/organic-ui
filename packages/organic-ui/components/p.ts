import { effect } from "../reactivity.js"

export function p({ text }: { text: () => string }) {
  let el: HTMLParagraphElement

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("p")
      parent.appendChild(el)

      effect(() => {
        el.textContent = text()
      })
    },
    unmount() {
      el.remove()
    }
  }
}
