import { effect, state } from "organic-ui/reactivity"

export function Accordion({ title, content }: { title: string; content: () => string }) {
  const [open, setOpen] = state(false)

  let wrapper: HTMLDivElement, header: HTMLDivElement, body: HTMLDivElement

  return {
    mount(parent: HTMLElement) {
      wrapper = document.createElement("div")
      wrapper.style.border = "1px solid #ccc"
      wrapper.style.borderRadius = "8px"
      wrapper.style.margin = "4px 0"
      wrapper.style.overflow = "hidden"

      // Header
      header = document.createElement("div")
      header.style.cursor = "pointer"
      header.style.background = "#eee"
      header.style.padding = "8px"
      header.onclick = () => setOpen(!open())
      header.textContent = title
      wrapper.appendChild(header)

      // Body
      body = document.createElement("div")
      body.style.padding = "8px"
      body.style.display = "none"
      wrapper.appendChild(body)

      // Reactive effect
      effect(() => {
        body.style.display = open() ? "block" : "none"
        body.textContent = open() ? content() : ""
      })

      parent.appendChild(wrapper)
    },
    unmount() {
      wrapper.remove()
    }
  }
}