import { div } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function GettingStarted() {

  return div({
    children: [
      div({
        text: "Getting Started",
        class: "docs-page-title"
      }),
      div({
        id: "installation",
        text: "Installation",
        class: "docs-section-title"
      }),
      CodeViewer({ code: "pnpm install organic-ui" }),
      div({
        id: "quick-example",
        text: "Quick Example",
        class: "docs-section-title"
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
        text: "+", 
        onClick: () => setCount(count() + 1) 
      })
    ]
  })
}

const root = document.getElementById("app")!
render(() => Counter({ label: "Clicks" }), root)`,
        language: "typescript"
      })
    ]
  })
}
