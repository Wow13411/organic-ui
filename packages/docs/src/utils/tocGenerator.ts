import type { TocItem } from "../components/layout/index.js"

/**
 * Extracts TOC items from the current page by finding all elements
 * with the class "docs-section-title" that have an id attribute
 */
export function extractTocFromPage(): TocItem[] {
  const sectionElements = document.querySelectorAll('.docs-section-title[id]')
  
  const items: TocItem[] = []
  sectionElements.forEach(element => {
    const id = element.getAttribute('id')
    const text = element.textContent
    
    if (id && text) {
      items.push({ id, text })
    }
  })
  
  return items
}
