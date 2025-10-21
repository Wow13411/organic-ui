import { div, Show } from "organic-ui/components"
import { Header } from "./Header.js"
import { Sidebar } from "./Sidebar.js"
import type { SidebarSection } from "./Sidebar.js"
import { TableOfContents } from "./TableOfContents.js"

export interface PageLayoutProps {
  sections: SidebarSection[]
  activeSection: () => string
  isMobileMenuOpen: () => boolean
  onMenuToggle: () => void
  onSectionClick: (sectionId: string) => void
  onTocItemClick: (sectionId: string, itemId: string) => void
  children: any
}

export function PageLayout({
  sections,
  activeSection,
  isMobileMenuOpen,
  onMenuToggle,
  onSectionClick,
  onTocItemClick,
  children
}: PageLayoutProps) {
  return div({
    className: "docs-app",
    children: [
      // Header (visible on mobile)
      Header({
        onMenuClick: onMenuToggle
      }),
      
      // Sidebar
      Sidebar({
        sections,
        activeSection,
        isOpen: isMobileMenuOpen,
        onSectionClick: (sectionId) => {
          onSectionClick(sectionId)
        }
      }),
      
      // Overlay for mobile menu
      Show({
        when: isMobileMenuOpen,
        children: div({
          onClick: onMenuToggle,
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
            children
          }),
          
          // Table of Contents (right sidebar) - auto-generated from page content
          TableOfContents({
            activeSection,
            onItemClick: onTocItemClick
          })
        ]
      })
    ]
  })
}
