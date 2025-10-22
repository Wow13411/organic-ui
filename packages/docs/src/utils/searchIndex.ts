export interface SearchResult {
  title: string
  section: string
  sectionId: string
  subsection?: string
  subsectionId?: string
  content: string
  score: number
}

interface IndexedContent {
  section: string
  sectionId: string
  title: string
  subsection?: string
  subsectionId?: string
  content: string
}

// Simple fuzzy search implementation
function fuzzyMatch(query: string, text: string): number {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower)
    // Earlier matches score higher
    return 100 - index
  }
  
  // Fuzzy matching - check if all query characters appear in order
  let queryIndex = 0
  let score = 0
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 10
      queryIndex++
    }
  }
  
  // Return score only if all query characters were found
  return queryIndex === queryLower.length ? score : 0
}

export function buildSearchIndex(): IndexedContent[] {
  const index: IndexedContent[] = []
  
  // Get all section pages
  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "getting-started", title: "Getting Started" },
    { id: "reactivity", title: "Reactivity" },
    { id: "components", title: "Components" },
    { id: "examples", title: "Examples" },
    { id: "benchmarks", title: "Benchmarks" }
  ]
  
  sections.forEach(section => {
    // Add section itself
    index.push({
      section: section.title,
      sectionId: section.id,
      title: section.title,
      content: section.title
    })
    
    // Find all subsections in the DOM (when available)
    const subsections = document.querySelectorAll(`[data-section="${section.id}"] .docs-section-title[id]`)
    subsections.forEach(el => {
      const subsectionId = el.getAttribute("id")
      const subsectionTitle = el.textContent || ""
      
      if (subsectionId && subsectionTitle) {
        // Get content after this heading until next heading
        let content = subsectionTitle
        let nextEl = el.nextElementSibling
        
        while (nextEl && !nextEl.classList.contains("docs-section-title")) {
          content += " " + (nextEl.textContent || "")
          nextEl = nextEl.nextElementSibling
        }
        
        index.push({
          section: section.title,
          sectionId: section.id,
          title: section.title,
          subsection: subsectionTitle,
          subsectionId,
          content: content.slice(0, 300) // Limit content length
        })
      }
    })
  })
  
  return index
}

export function search(query: string, index: IndexedContent[]): SearchResult[] {
  if (!query.trim()) return []
  
  const results: SearchResult[] = []
  
  index.forEach(item => {
    // Search in title
    const titleScore = fuzzyMatch(query, item.subsection || item.title)
    // Search in content
    const contentScore = fuzzyMatch(query, item.content) * 0.5
    
    const totalScore = titleScore + contentScore
    
    if (totalScore > 0) {
      results.push({
        title: item.title,
        section: item.section,
        sectionId: item.sectionId,
        subsection: item.subsection,
        subsectionId: item.subsectionId,
        content: item.content,
        score: totalScore
      })
    }
  })
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score).slice(0, 10)
}
