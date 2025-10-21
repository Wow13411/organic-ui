import { button, div, p } from "organic-ui/components"
import { state } from "organic-ui/reactivity"
import "./components.css"

export function Counter({ label }: { label: string }) {
  const [count, setCount] = state(0)

  return div({
    className: "counter-container",
    children: [
      p({ text: () => `${label}: ${count()}` }),
      button({ text: () => "+", onClick: () => setCount(c => c + 1) }),
      button({ text: () => "-", onClick: () => setCount(c => c - 1) })
    ]
  })
}