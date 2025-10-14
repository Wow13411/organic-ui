import { state, effect } from "organic-ui/reactivity"
import { div, a, Show, Switch } from "organic-ui/components"
import { Introduction } from "./docs/Introduction.js"
import { GettingStarted } from "./docs/GettingStarted.js"
import { Reactivity } from "./docs/Reactivity.js"
import { Components } from "./docs/Components.js"
import { Examples } from "./docs/Examples.js"

type Section = "intro" | "getting-started" | "reactivity" | "components" | "examples"

function getSectionFromHash(): Section {
  const hash = window.location.hash.slice(1) // Remove the '#'
  // Extract section from hash (e.g., "reactivity/state" -> "reactivity")
  const section = hash.split('/')[0]
  const validSections: Section[] = ["intro", "getting-started", "reactivity", "components", "examples"]
  return validSections.includes(section as Section) ? (section as Section) : "intro"
}

function scrollToSubsection() {
  const hash = window.location.hash.slice(1)
  const parts = hash.split('/')
  if (parts.length > 1) {
    const subsectionId = parts[1]
    // Wait for the DOM to update before scrolling
    setTimeout(() => {
      const element = document.getElementById(subsectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

function createTocItem(text: string, id: string, section: Section) {
  return a({ 
    href: `#${section}/${id}`,
    text, 
    style: { 
      display: "block",
      marginBottom: "8px", 
      color: "#666", 
      textDecoration: "none",
      cursor: "pointer" 
    },
    onClick: (e) => {
      e.preventDefault()
      window.location.hash = `${section}/${id}`
      scrollToSubsection()
    }
  })
}

export function DocsApp() {
  const [activeSection, setActiveSection] = state<Section>(getSectionFromHash())

  const sections: { id: Section; label: string; component: () => any }[] = [
    { id: "intro", label: "Introduction", component: Introduction },
    { id: "getting-started", label: "Getting Started", component: GettingStarted },
    { id: "reactivity", label: "Reactivity", component: Reactivity },
    { id: "components", label: "Components", component: Components },
    { id: "examples", label: "Examples", component: Examples }
  ]

  // Update URL when activeSection changes (only if not already set)
  effect(() => {
    const currentHash = window.location.hash.slice(1)
    const currentSection = currentHash.split('/')[0]
    if (currentSection !== activeSection()) {
      window.history.pushState(null, "", `#${activeSection()}`)
    }
  })

  // Listen to browser back/forward navigation
  window.addEventListener("hashchange", () => {
    setActiveSection(getSectionFromHash())
    scrollToSubsection()
  })

  // Scroll to subsection on initial load
  scrollToSubsection()

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
            a({
              href: `#${section.id}`,
              text: section.label,
              onClick: (e) => {
                e.preventDefault()
                setActiveSection(section.id)
              },
              style: () => ({
                display: "block",
                width: "100%",
                padding: "10px 15px",
                marginBottom: "5px",
                background: activeSection() === section.id ? "#007bff" : "transparent",
                color: activeSection() === section.id ? "white" : "#333",
                textDecoration: "none",
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
                  Switch({
                    on: activeSection,
                    cases: [
                      {
                        when: "intro",
                        children: div({
                          children: [
                            createTocItem("Features", "features", "intro"),
                            createTocItem("Philosophy", "philosophy", "intro")
                          ]
                        })
                      },
                      {
                        when: "getting-started",
                        children: div({
                          children: [
                            createTocItem("Installation", "installation", "getting-started"),
                            createTocItem("Quick Example", "quick-example", "getting-started")
                          ]
                        })
                      },
                      {
                        when: "reactivity",
                        children: div({
                          children: [
                            createTocItem("state()", "state", "reactivity"),
                            createTocItem("effect()", "effect", "reactivity")
                          ]
                        })
                      },
                      {
                        when: "components",
                        children: div({
                          children: [
                            createTocItem("For", "for", "components"),
                            createTocItem("Show", "show", "components"),
                            createTocItem("Switch", "switch", "components"),
                            createTocItem("HTML Elements", "html-elements", "components")
                          ]
                        })
                      },
                      {
                        when: "examples",
                        children: div({
                          children: [
                            createTocItem("Counter", "counter", "examples"),
                            createTocItem("Accordion", "accordion", "examples"),
                            createTocItem("Todo List", "todo-list", "examples")
                          ]
                        })
                      }
                    ]
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
