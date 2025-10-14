import { state } from "organic-ui/reactivity"
import { p, button } from "organic-ui/components"

export function App1() {
  const [count, setCount] = state(0)

  return [
    p({ text: () => `Count = ${count()}` }),
    button({
      text: () => "Increment",
      onClick: () => setCount(count() + 1)
    })
  ]
}
