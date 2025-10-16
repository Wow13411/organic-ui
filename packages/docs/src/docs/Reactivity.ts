import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function Reactivity() {

  return div({
    children: [
      div({
        text: "Reactivity",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2c3e50"
        }
      }),
      div({
        id: "state",
        text: "state()",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Create reactive state that automatically updates the UI when changed.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Run side effects that automatically re-run when dependencies change.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
        style: { marginTop: "15px", marginBottom: "15px", lineHeight: "1.6" }
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
      })
    ]
  })
}
