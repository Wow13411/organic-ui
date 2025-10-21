import { div, a, For, Show } from "organic-ui/components"
import { state, effect } from "organic-ui/reactivity"
import { extractTocFromPage } from "../../utils/tocGenerator.js"

export interface TocItem {
  text: string
  id: string
}

export interface TocSection {
  sectionId: string
  items: TocItem[]
}

export interface TableOfContentsProps {
  activeSection: () => string
  onItemClick: (sectionId: string, itemId: string) => void
}

function createTocItem(text: string, id: string, section: string, onClick: (sectionId: string, itemId: string) => void) {
  return a({ 
    href: `#${section}/${id}`,
    text,
    className: "toc-item",
    onClick: (e) => {
      e.preventDefault()
      onClick(section, id)
    }
  })
}

export function TableOfContents({ activeSection, onItemClick }: TableOfContentsProps) {
  const [tocItems, setTocItems] = state<TocItem[]>([])

  // Extract TOC items whenever the active section changes
  effect(() => {
    const section = activeSection()
    // Wait for DOM to update after section change
    setTimeout(() => {
      const items = extractTocFromPage()
      setTocItems(items)
    }, 50)
    
    // Use section to ensure effect tracks activeSection changes
    void section
  })

  return Show({
    when: () => tocItems().length > 0,
    children: div({
      className: "toc",
      children: [
        div({
          text: "On this page",
          className: "toc-title"
        }),
        div({
          className: "toc-list",
          children: [
            For({
              each: tocItems,
              children: (item) => createTocItem(item.text, item.id, activeSection(), onItemClick)
            })
          ]
        })
      ]
    })
  })
}
