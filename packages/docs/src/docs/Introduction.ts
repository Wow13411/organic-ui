import { div, p } from "organic-ui/components"

export function Introduction() {
  return div({
    children: [
      div({
        text: "Introduction",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "organic-ui is a lightweight reactive UI framework with fine-grained reactivity and declarative components.",
        style: {
          fontSize: "18px",
          lineHeight: "1.6",
          marginBottom: "20px",
          color: "#555"
        }
      }),
      div({
        id: "features",
        text: "Features",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      div({
        style: {
          marginLeft: "20px"
        },
        children: [
          p({
            text: () => "• Fine-grained reactivity - Efficient updates with reactive state",
            style: { marginBottom: "10px", lineHeight: "1.6" }
          }),
          p({
            text: () => "• Declarative components - Compose UIs with simple functions",
            style: { marginBottom: "10px", lineHeight: "1.6" }
          }),
          p({
            text: () => "• Zero dependencies - Pure TypeScript implementation",
            style: { marginBottom: "10px", lineHeight: "1.6" }
          }),
          p({
            text: () => "• Tiny footprint - Minimal runtime overhead",
            style: { marginBottom: "10px", lineHeight: "1.6" }
          })
        ]
      }),
      div({
        id: "philosophy",
        text: "Philosophy",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "organic-ui provides reactive primitives (state, effect, For, Show) and common HTML elements. For specialized elements or complex UI patterns, create custom components or use a component library built on organic-ui. The framework focuses on being a solid foundation rather than a complete UI toolkit.",
        style: {
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#555"
        }
      })
    ]
  })
}
