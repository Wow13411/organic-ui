import { state } from "organic-ui/reactivity"
import { div, p } from "organic-ui/components"

export function Accordion({ title, content }: { title: string; content: () => string }) {
  const [open, setOpen] = state(false)

  return div({
    style: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      margin: "4px 0",
      overflow: "hidden"
    },
    children: [
      div({
        text: title,
        style: {
          cursor: "pointer",
          background: "#eee",
          padding: "8px"
        },
        onClick: () => setOpen(!open())
      }),
      p({
        text: () => open() ? content() : ""
      })
    ]
  })
}