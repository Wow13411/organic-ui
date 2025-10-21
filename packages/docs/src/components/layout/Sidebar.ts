import { div, a, img } from "organic-ui/components"

export interface SidebarSection {
  id: string
  label: string
}

export interface SidebarProps {
  sections: SidebarSection[]
  activeSection: () => string
  isOpen: () => boolean
  onSectionClick: (sectionId: string) => void
}

export function Sidebar({ sections, activeSection, isOpen, onSectionClick }: SidebarProps) {
  return div({
    className: () => `sidebar ${isOpen() ? "open" : "closed"}`,
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
              onSectionClick(section.id)
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
  })
}
