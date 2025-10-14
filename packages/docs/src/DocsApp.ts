import { state } from "organic-ui/reactivity"
import { div, button, Show } from "organic-ui/components"
import { Introduction } from "./docs/Introduction.js"
import { GettingStarted } from "./docs/GettingStarted.js"
import { Reactivity } from "./docs/Reactivity.js"
import { Components } from "./docs/Components.js"
import { Examples } from "./docs/Examples.js"

type Section = "intro" | "getting-started" | "reactivity" | "components" | "examples"

export function DocsApp() {
  const [activeSection, setActiveSection] = state<Section>("intro")

  const sections: { id: Section; label: string; component: () => any }[] = [
    { id: "intro", label: "Introduction", component: Introduction },
    { id: "getting-started", label: "Getting Started", component: GettingStarted },
    { id: "reactivity", label: "Reactivity", component: Reactivity },
    { id: "components", label: "Components", component: Components },
    { id: "examples", label: "Examples", component: Examples }
  ]

  return div({
    style: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    children: [
      // Sidebar
      div({
        style: {
          width: "250px",
          background: "#f8f9fa",
          padding: "20px",
          borderRight: "1px solid #e0e0e0",
          position: "sticky",
          top: "0",
          height: "100vh",
          overflowY: "auto"
        },
        children: [
          div({
            text: "organic-ui",
            style: {
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "30px",
              color: "#2c3e50"
            }
          }),
          ...sections.map(section =>
            button({
              text: () => section.label,
              onClick: () => setActiveSection(section.id),
              style: () => ({
                display: "block",
                width: "100%",
                padding: "10px 15px",
                marginBottom: "5px",
                border: "none",
                background: activeSection() === section.id ? "#007bff" : "transparent",
                color: activeSection() === section.id ? "white" : "#333",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: activeSection() === section.id ? "600" : "normal"
              })
            })
          )
        ]
      }),
      // Main content area with TOC
      div({
        style: {
          flex: "1",
          display: "flex",
          gap: "40px",
          padding: "40px"
        },
        children: [
          // Content
          div({
            style: {
              flex: "1",
              maxWidth: "700px"
            },
            children: sections.map(section =>
              Show({
                when: () => activeSection() === section.id,
                children: section.component()
              })
            )
          }),
          // Table of Contents (right sidebar)
          div({
            style: {
              width: "200px",
              position: "sticky",
              top: "40px",
              height: "fit-content",
              fontSize: "14px"
            },
            children: [
              div({
                text: "On this page",
                style: {
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "#2c3e50"
                }
              }),
              div({
                style: {
                  borderLeft: "2px solid #e0e0e0",
                  paddingLeft: "15px"
                },
                children: [
                  Show({
                    when: () => activeSection() === "intro",
                    children: div({
                      children: [
                        div({ text: "Features", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "Philosophy", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } })
                      ]
                    })
                  }),
                  Show({
                    when: () => activeSection() === "getting-started",
                    children: div({
                      children: [
                        div({ text: "Installation", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "Quick Example", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } })
                      ]
                    })
                  }),
                  Show({
                    when: () => activeSection() === "reactivity",
                    children: div({
                      children: [
                        div({ text: "state()", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "effect()", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } })
                      ]
                    })
                  }),
                  Show({
                    when: () => activeSection() === "components",
                    children: div({
                      children: [
                        div({ text: "For", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "Show", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "HTML Elements", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } })
                      ]
                    })
                  }),
                  Show({
                    when: () => activeSection() === "examples",
                    children: div({
                      children: [
                        div({ text: "Counter", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "Accordion", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } }),
                        div({ text: "Todo List", style: { marginBottom: "8px", color: "#666", cursor: "pointer" } })
                      ]
                    })
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  })
}
