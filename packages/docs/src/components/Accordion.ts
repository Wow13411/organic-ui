import { state } from "organic-ui/reactivity"
import { div, p, Show } from "organic-ui/components"

export function Accordion({ title, content }: { title: string; content: () => string }) {
  const [open, setOpen] = state(false)

  return div({
    class: "accordion",
    children: [
      div({
        text: title,
        class: "accordion-header",
        onClick: () => setOpen(isOpen => !isOpen)
      }),
      Show({
        when: open,
        children: p({
          text: content,
          class: "accordion-content"
        })
      })
    ]
  })
}