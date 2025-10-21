import { state } from "organic-ui/reactivity"
import { div, p, Show } from "organic-ui/components"
import "./components.css"

export function Accordion({ title, content }: { title: string; content: () => string }) {
  const [open, setOpen] = state(false)

  return div({
    className: "accordion",
    children: [
      div({
        text: title,
        className: "accordion-header",
        onClick: () => setOpen(isOpen => !isOpen)
      }),
      Show({
        when: open,
        children: p({
          text: content,
          className: "accordion-content"
        })
      })
    ]
  })
}