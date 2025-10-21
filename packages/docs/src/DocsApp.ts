import { state, effect } from "organic-ui/reactivity"
import { div, a, img, Show, Switch, button } from "organic-ui/components"
import { Introduction } from "./docs/Introduction.js"
import { GettingStarted } from "./docs/GettingStarted.js"
import { Reactivity } from "./docs/Reactivity.js"
import { Components } from "./docs/Components.js"
import { Examples } from "./docs/Examples.js"
import { Benchmarks } from "./docs/Benchmarks.js"
import "./DocsApp.css"

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
    className: "toc-item",
    onClick: (e) => {
      e.preventDefault()
      window.location.hash = `${section}/${id}`
      scrollToSubsection()
    }
  })
}

export function DocsApp() {
  const [activeSection, setActiveSection] = state<Section>(getSectionFromHash())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = state(false)

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
    className: "docs-app",
    children: [
      // Mobile menu button
      button({
        text: () => "☰",
        onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen()),
        className: "mobile-menu-button"
      }),
      // Sidebar
      div({
        className: () => `sidebar ${isMobileMenuOpen() ? "open" : "closed"}`,
        children: [
          div({
            className: "sidebar-header",
            children: [
              img({
                src: "logo.svg",
                alt: "organic-ui logo",
                width: 32,
                height: 32,
                className: "sidebar-logo"
              }),
              div({
                text: "organic-ui",
                className: "sidebar-title"
              })
            ]
          }),
          // Navigation items in scrollable container
          div({
            className: "sidebar-nav",
            children: sections.map(section =>
              a({
                href: `#${section.id}`,
                text: section.label,
                onClick: (e) => {
                  e.preventDefault()
                  setActiveSection(section.id)
                  setIsMobileMenuOpen(false)
                },
                className: () => `sidebar-nav-item ${activeSection() === section.id ? "active" : ""}`
              })
            )
          }),
          // Links section at bottom
          div({
            className: "sidebar-footer",
            children: [
              div({
                text: "Links",
                className: "sidebar-footer-title"
              }),
              a({
                href: "https://github.com/pavi2410/organic-ui",
                text: "GitHub",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "sidebar-footer-link"
              }),
              a({
                href: "https://www.npmjs.com/package/organic-ui",
                text: "npm",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "sidebar-footer-link"
              })
            ]
          })
        ]
      }),
      // Overlay for mobile menu
      Show({
        when: isMobileMenuOpen,
        children: div({
          onClick: () => setIsMobileMenuOpen(false),
          className: "mobile-overlay"
        })
      }),
      // Main content area with TOC
      div({
        className: "main-content-area",
        children: [
          // Content
          div({
            className: "content",
            children: sections.map(section =>
              Show({
                when: () => activeSection() === section.id,
                children: section.component()
              })
            )
          }),
          // Table of Contents (right sidebar)
          div({
            className: "toc",
            children: [
              div({
                text: "On this page",
                className: "toc-title"
              }),
              div({
                className: "toc-list",
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
                            createTocItem("effect()", "effect", "reactivity"),
                            createTocItem("memo()", "memo", "reactivity")
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
