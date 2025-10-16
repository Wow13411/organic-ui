import { button, div, p } from "organic-ui/components"
import { state } from "organic-ui/reactivity"

export function Counter({ label }: { label: string }) {
  const [count, setCount] = state(0)

  return div({
    style: { 
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    children: [
      p({ text: () => `${label}: ${count()}` }),
      button({ text: () => "+", onClick: () => setCount(c => c + 1) }),
      button({ text: () => "-", onClick: () => setCount(c => c - 1) })
    ]
  })
}