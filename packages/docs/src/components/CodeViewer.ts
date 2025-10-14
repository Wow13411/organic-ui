import { div } from "organic-ui/components"

interface CodeViewerProps {
  code: string
  language?: string
}

// TypeScript keywords
const TS_KEYWORDS = new Set([
  'abstract', 'any', 'as', 'async', 'await', 'boolean', 'break', 'case', 'catch',
  'class', 'const', 'constructor', 'continue', 'debugger', 'declare', 'default',
  'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for',
  'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'instanceof',
  'interface', 'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null',
  'number', 'object', 'of', 'package', 'private', 'protected', 'public', 'readonly',
  'return', 'set', 'static', 'string', 'super', 'switch', 'symbol', 'this', 'throw',
  'true', 'try', 'type', 'typeof', 'undefined', 'unknown', 'var', 'void', 'while',
  'with', 'yield'
])

const TokenType = {
  Keyword: 'keyword',
  String: 'string',
  Number: 'number',
  Comment: 'comment',
  Operator: 'operator',
  Punctuation: 'punctuation',
  Identifier: 'identifier'
} as const;

interface Token {
  type: typeof TokenType[keyof typeof TokenType]
  start: number
  end: number
  value: string
}

// Simple TypeScript lexer
function lexTypeScript(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    const char = code[i]

    // Skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }

    // Single-line comment
    if (char === '/' && code[i + 1] === '/') {
      const start = i
      i += 2
      while (i < code.length && code[i] !== '\n') {
        i++
      }
      tokens.push({ type: TokenType.Comment, start, end: i, value: code.slice(start, i) })
      continue
    }

    // Multi-line comment
    if (char === '/' && code[i + 1] === '*') {
      const start = i
      i += 2
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) {
        i++
      }
      i += 2
      tokens.push({ type: TokenType.Comment, start, end: i, value: code.slice(start, i) })
      continue
    }

    // String literals (single and double quotes)
    if (char === '"' || char === "'") {
      const start = i
      const quote = char
      i++
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i++ // Skip escaped characters
        i++
      }
      i++ // Closing quote
      tokens.push({ type: TokenType.String, start, end: i, value: code.slice(start, i) })
      continue
    }

    // Template literals
    if (char === '`') {
      const start = i
      i++
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') i++ // Skip escaped characters
        i++
      }
      i++ // Closing backtick
      tokens.push({ type: TokenType.String, start, end: i, value: code.slice(start, i) })
      continue
    }

    // Numbers
    if (/\d/.test(char)) {
      const start = i
      while (i < code.length && /[\d._]/.test(code[i])) {
        i++
      }
      tokens.push({ type: TokenType.Number, start, end: i, value: code.slice(start, i) })
      continue
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(char)) {
      const start = i
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
        i++
      }
      const value = code.slice(start, i)
      const type = TS_KEYWORDS.has(value) ? TokenType.Keyword : TokenType.Identifier
      tokens.push({ type, start, end: i, value })
      continue
    }

    // Operators and punctuation
    if (/[+\-*/%=<>!&|^~?:;,.()\[\]{}]/.test(char)) {
      const start = i
      i++
      // Handle multi-character operators
      if (i < code.length && /[=<>&|+\-*]/.test(code[i])) {
        i++
      }
      tokens.push({ type: TokenType.Operator, start, end: i, value: code.slice(start, i) })
      continue
    }

    // Unknown character, skip it
    i++
  }

  return tokens
}

// Apply CSS Custom Highlight API
let styleElement: HTMLStyleElement | null = null

function ensureHighlightStyles() {
  if (styleElement) return

  styleElement = document.createElement('style')
  styleElement.textContent = `
    ::highlight(keyword) { color: #0000ff; font-weight: 600; }
    ::highlight(string) { color: #a31515; }
    ::highlight(number) { color: #098658; }
    ::highlight(comment) { color: #008000; font-style: italic; }
    ::highlight(operator) { color: #000000; }
    ::highlight(identifier) { color: #001080; }
  `
  document.head.appendChild(styleElement)
}

function applyHighlighting(element: HTMLElement, code: string): Map<string, Highlight> {
  if (!CSS.highlights) {
    console.warn('CSS Custom Highlight API not supported')
    return new Map()
  }

  ensureHighlightStyles()

  const tokens = lexTypeScript(code)
  const highlights = new Map<string, Highlight>()

  // Group tokens by type
  const highlightsByType = new Map<typeof TokenType[keyof typeof TokenType], Range[]>()

  tokens.forEach(token => {
    if (!highlightsByType.has(token.type)) {
      highlightsByType.set(token.type, [])
    }

    const range = new Range()
    const textNode = element.firstChild
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      range.setStart(textNode, token.start)
      range.setEnd(textNode, token.end)
      highlightsByType.get(token.type)!.push(range)
    }
  })

  // Create highlights and add to global registry
  highlightsByType.forEach((ranges, type) => {
    const highlight = new Highlight(...ranges)
    highlights.set(type, highlight)
    
    // Get existing highlight or create new one
    const existing = CSS.highlights.get(type)
    if (existing) {
      // Add our ranges to existing highlight
      ranges.forEach(range => existing.add(range))
    } else {
      CSS.highlights.set(type, highlight)
    }
  })

  return highlights
}

// Custom renderable for highlighted code
function HighlightedCode(code: string, language: string) {
  let el: HTMLDivElement
  let highlights: Map<string, Highlight> = new Map()

  return {
    mount(parent: HTMLElement) {
      el = document.createElement("div")
      el.textContent = code
      el.style.color = "#2c3e50"
      
      parent.appendChild(el)
      
      // Apply highlighting after mounting
      if (language === "typescript"
        || language === "javascript"
        || language === "ts"
        || language === "js"
      ) {
        highlights = applyHighlighting(el, code)
      }
    },
    unmount() {
      // Clean up highlights by removing our ranges
      highlights.forEach((highlight, type) => {
        const globalHighlight = CSS.highlights?.get(type)
        if (globalHighlight) {
          // Remove all our ranges from the global highlight
          highlight.forEach(range => globalHighlight.delete(range))
          // If empty, remove the highlight entirely
          if (globalHighlight.size === 0) {
            CSS.highlights?.delete(type)
          }
        }
      })
      el.remove()
    }
  }
}

export function CodeViewer({ code, language = "plaintext" }: CodeViewerProps) {
  return div({
    style: {
      background: "#f5f5f5",
      padding: "15px",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "14px",
      overflowX: "auto",
      marginBottom: "20px",
      border: "1px solid #e0e0e0",
      whiteSpace: "pre",
      lineHeight: "1.5"
    },
    children: [HighlightedCode(code, language)]
  })
}
