import { Accordion } from "./components/Accordion.js"

export function App2() {
  return [
    Accordion({
      title: "Section 1",
      content: () => "This is the first section’s content."
    }),
    Accordion({
      title: "Section 2",
      content: () => "Here’s some more text for section two."
    }),
    Accordion({
      title: "Section 3",
      content: () => "And this is section three."
    })
  ]
}
