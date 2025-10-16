import { state, effect } from "organic-ui/reactivity"
import { div, a, img, Show, Switch } from "organic-ui/components"
import { Introduction } from "./docs/Introduction.js"
import { GettingStarted } from "./docs/GettingStarted.js"
import { Reactivity } from "./docs/Reactivity.js"
import { Components } from "./docs/Components.js"
import { Examples } from "./docs/Examples.js"
import { Benchmarks } from "./docs/Benchmarks.js"

type Section = "intro" | "getting-started" | "reactivity" | "components" | "examples" | "benchmarks"

function getSectionFromHash(): Section {
  const hash = window.location.hash.slice(1) // Remove the '#'
  // Extract section from hash (e.g., "reactivity/state" -> "reactivity")
  const section = hash.split('/')[0]
  const validSections: Section[] = ["intro", "getting-started", "reactivity", "components", "examples", "benchmarks"]
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
    { id: "examples", label: "Examples", component: Examples },
    { id: "benchmarks", label: "Benchmarks", component: Benchmarks }
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
      minHeight: "100dvh",
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    children: [
      // Sidebar
      div({
        style: {
          width: "250px",
          background: "#f8f9fa",
          padding: "20px",
          paddingRight: "0",
          borderRight: "1px solid #e0e0e0",
          position: "sticky",
          top: "0",
          height: "100dvh",
          display: "flex",
          flexDirection: "column"
        },
        children: [
          div({
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "12px",
              marginBottom: "30px"
            },
            children: [
              img({
                src: "logo.svg",
                alt: "organic-ui logo",
                width: 32,
                height: 32,
                style: {
                  boxShadow: "0px 0px 8px #0001",
                  borderRadius: "8px",
                }
              }),
              div({
                text: "organic-ui",
                style: {
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }
              })
            ]
          }),
          // Navigation items in scrollable container
          div({
            style: {
              flex: "1",
              overflowY: "auto",
              minHeight: "0"
            },
            children: sections.map(section =>
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
                  fontWeight: activeSection() === section.id ? "600" : "normal",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                })
              })
            )
          }),
          // Links section at bottom
          div({
            style: {
              flexShrink: "0",
              paddingTop: "20px",
              borderTop: "1px solid #e0e0e0"
            },
            children: [
              div({
                text: "Links",
                style: {
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#666",
                  textTransform: "uppercase"
                }
              }),
              a({
                href: "https://github.com/pavi2410/organic-ui",
                text: "GitHub",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  display: "block",
                  padding: "8px 0",
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px"
                }
              }),
              a({
                href: "https://www.npmjs.com/package/organic-ui",
                text: "npm",
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  display: "block",
                  padding: "8px 0",
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px"
                }
              })
            ]
          })
        ]
      }),
      // Main content area with TOC
      div({
        style: {
          flex: "1",
          display: "flex",
          gap: "40px",
          padding: "40px",
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
                            createTocItem("html", "html", "components"),
                            createTocItem("HTML Elements", "html-elements", "components"),
                            createTocItem("ref", "ref", "components")
                          ]
                        })
                      },
                      {
                        when: "examples",
                        children: div({
                          children: [
                            createTocItem("Counter", "counter", "examples"),
                            createTocItem("Accordion", "accordion", "examples"),
                            createTocItem("HTML Component Demo", "html-demo", "examples"),
                            createTocItem("Todo List", "todo-list", "examples"),
                            createTocItem("Metronome", "metronome", "examples")
                          ]
                        })
                      },
                      {
                        when: "benchmarks",
                        children: div({
                          children: [
                            createTocItem("Performance Tests", "performance", "benchmarks"),
                            createTocItem("Results Summary", "results", "benchmarks"),
                            createTocItem("Comparison", "comparison", "benchmarks")
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
