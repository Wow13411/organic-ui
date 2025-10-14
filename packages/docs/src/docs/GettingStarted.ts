import { div } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function GettingStarted() {

  return div({
    children: [
      div({
        text: "Getting Started",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2c3e50"
        }
      }),
      div({
        text: "Installation",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      CodeViewer({ code: "pnpm install" }),
      div({
        text: "Quick Example",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      CodeViewer({ 
        code: `import { render } from "organic-ui/renderer"
import { state } from "organic-ui/reactivity"
import { div, button, p } from "organic-ui/components"

function Counter({ label }) {
  const [count, setCount] = state(0)

  return div({
    children: [
      p({ text: () => \`\${label}: \${count()}\` }),
      button({ 
        text: () => "+", 
        onClick: () => setCount(count() + 1) 
      })
    ]
  })
}

const root = document.getElementById("app")!
render(() => [Counter({ label: "Clicks" })], root)`,
        language: "typescript"
      })
    ]
  })
}
