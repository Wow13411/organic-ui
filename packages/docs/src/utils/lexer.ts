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

export const TokenType = {
  Keyword: 'keyword',
  String: 'string',
  Number: 'number',
  Comment: 'comment',
  Operator: 'operator',
  Punctuation: 'punctuation',
  Identifier: 'identifier'
} as const;

export interface Token {
  type: typeof TokenType[keyof typeof TokenType]
  start: number
  end: number
  value: string
}

// Simple TypeScript lexer
export function lexTypeScript(code: string): Token[] {
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

    // Template literals with interpolation support
    if (char === '`') {
      const templateStart = i
      i++ // Skip opening backtick
      let lastStringStart = templateStart
      
      while (i < code.length && code[i] !== '`') {
        // Check for interpolation ${...}
        if (code[i] === '$' && code[i + 1] === '{') {
          // Add the template string part before interpolation (including backtick/previous content)
          if (i > lastStringStart) {
            tokens.push({ type: TokenType.String, start: lastStringStart, end: i, value: code.slice(lastStringStart, i) })
          }
          
          // Skip ${
          i += 2
          const interpolationStart = i
          
          // Find matching closing brace
          let braceDepth = 1
          while (i < code.length && braceDepth > 0) {
            if (code[i] === '{') braceDepth++
            else if (code[i] === '}') braceDepth--
            if (braceDepth > 0) i++
          }
          
          // Recursively tokenize the interpolation content
          const interpolationCode = code.slice(interpolationStart, i)
          const interpolationTokens = lexTypeScript(interpolationCode)
          
          // Adjust token positions to be relative to the original code
          for (const token of interpolationTokens) {
            tokens.push({
              type: token.type,
              start: interpolationStart + token.start,
              end: interpolationStart + token.end,
              value: token.value
            })
          }
          
          i++ // Skip closing brace
          lastStringStart = i // Next string part starts here
          continue
        }
        
        if (code[i] === '\\') {
          i++ // Skip escaped character
          if (i < code.length) i++
        } else {
          i++
        }
      }
      
      // Add the final template literal part (from last interpolation or start to closing backtick)
      if (i >= lastStringStart) {
        tokens.push({ type: TokenType.String, start: lastStringStart, end: i + 1, value: code.slice(lastStringStart, i + 1) })
      }
      
      i++ // Skip closing backtick
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
