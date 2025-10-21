import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"
import "./docs.css"

export function Reactivity() {

  return div({
    children: [
      div({
        text: "Reactivity",
        className: "docs-page-title"
      }),
      div({
        id: "state",
        text: "state()",
        className: "docs-section-title"
      }),
      p({
        text: () => "Create reactive state that automatically updates the UI when changed.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [count, setCount] = state(0)

// Read value
console.log(count())  // 0

// Update with new value
setCount(count() + 1)

// Update with function (receives current value)
setCount(prev => prev + 1)`,
        language: "typescript"
      }),
      div({
        id: "effect",
        text: "effect()",
        className: "docs-section-title"
      }),
      p({
        text: () => "Run side effects that automatically re-run when dependencies change.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [name, setName] = state("World")

effect(() => {
  console.log(\`Hello, \${name()}!\`)
})

setName("organic-ui")  // Logs: "Hello, organic-ui!"`,
        language: "typescript"
      }),
      p({
        text: () => "Effects can return a cleanup function that runs before the effect re-runs or when the component unmounts:",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [delay, setDelay] = state(1000)

effect(() => {
  const id = setInterval(() => {
    console.log("tick")
  }, delay())
  
  // Cleanup: runs when delay changes or component unmounts
  return () => clearInterval(id)
})

// Effects are automatically cleaned up when the component unmounts
// No manual disposal needed!`,
        language: "typescript"
      }),
      div({
        id: "memo",
        text: "memo()",
        className: "docs-section-title"
      }),
      p({
        text: () => "Create memoized computed values that only recompute when dependencies change.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [firstName, setFirstName] = state("John")
const [lastName, setLastName] = state("Doe")

// Memoized - only recomputes when firstName or lastName change
const fullName = memo(() => {
  console.log("Computing full name...")
  return \`\${firstName()} \${lastName()}\`
})

// Use it like a regular getter
console.log(fullName())  // "John Doe"

// Changing firstName triggers recomputation
setFirstName("Jane")
console.log(fullName())  // "Jane Doe"`,
        language: "typescript"
      }),
      p({
        text: () => "Memos are especially useful for expensive computations:",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [items, setItems] = state([1, 2, 3, 4, 5])

// Without memo - recalculates on every access
const sum = () => items().reduce((a, b) => a + b, 0)

// With memo - only recalculates when items change
const memoizedSum = memo(() => items().reduce((a, b) => a + b, 0))

// Both return the same value, but memo caches the result
console.log(sum())          // Calculates: 15
console.log(memoizedSum())  // Calculates: 15
console.log(memoizedSum())  // Cached: 15 (no recalculation!)`,
        language: "typescript"
      }),
      div({
        className: "docs-note",
        children: [
          p({
            text: () => "💡 See it in action:",
            style: {
              margin: "0 0 8px 0",
              fontWeight: "600",
              fontSize: "14px"
            }
          }),
          p({
            text: () => "Check out the interactive Memo example in the Examples section to see how memoized values only recompute when their dependencies change!",
            style: {
              margin: "0",
              fontSize: "14px",
              lineHeight: "1.6"
            }
          })
        ]
      })
    ]
  })
}
