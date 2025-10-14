import { div, p } from "organic-ui/components"
import { Card } from "./components/Card.js"
import { Counter } from "./components/Counter.js"

export function App3() {
  return [
    div({
      style: { padding: "16px", fontFamily: "sans-serif" },
      children: [
        p({ text: () => "Nested Components Example" }),
        Card({ title: "First Counter", child: Counter({ label: "Apples" }) }),
        Card({ title: "Second Counter", child: Counter({ label: "Bananas" }) })
      ]
    })
  ]
}