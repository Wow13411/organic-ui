import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function Components() {

  return div({
    children: [
      div({
        text: "Components",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2c3e50"
        }
      }),
      div({
        id: "for",
        text: "For - List Rendering",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Render dynamic lists that automatically update when the array changes.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
      }),
      CodeViewer({
        code: `const [items, setItems] = state(["A", "B", "C"])

For({
  each: items,
  children: (item, index) => div({
    text: \`Item \${index}: \${item}\`
  })
})`,
        language: "typescript"
      }),
      div({
        id: "show",
        text: "Show - Conditional Rendering",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Conditionally render components with optional fallback.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
      }),
      CodeViewer({
        code: `const [isLoggedIn, setIsLoggedIn] = state(false)

Show({
  when: isLoggedIn,
  children: div({ text: "Welcome back!" }),
  fallback: div({ text: "Please log in" })
})`,
        language: "typescript"
      }),
      div({
        id: "html-elements",
        text: "HTML Elements",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Common HTML elements: div, button, p, ul, li",
        style: { marginBottom: "15px", lineHeight: "1.6" }
      }),
      CodeViewer({
        code: `div({ 
  text: "Hello",
  style: { color: "blue" },
  className: "container",
  onClick: () => console.log("clicked"),
  children: [...]
})`,
        language: "typescript"
      })
    ]
  })
}
