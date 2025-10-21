import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"
import "./docs.css"

export function Components() {

  return div({
    children: [
      div({
        text: "Components",
        className: "docs-page-title"
      }),
      div({
        id: "for",
        text: "For - List Rendering",
        className: "docs-section-title"
      }),
      p({
        text: () => "Render dynamic lists that automatically update when the array changes.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [items, setItems] = state(["A", "B", "C"])

For({
  each: items,
  children: (item, index) => div({
    text: \`Item \${index}: \${item}\`
  })
})`,
        language: "typescript"
      }),
      p({
        text: () => "Use the key prop for efficient reconciliation when items can be reordered:",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [todos, setTodos] = state([
  { id: 1, text: "Learn Organic UI" },
  { id: 2, text: "Build an app" }
])

For({
  each: todos,
  key: (todo) => todo.id,  // Reuse DOM nodes when IDs match
  children: (todo) => div({
    text: () => todo.text
  })
})`,
        language: "typescript"
      }),
      p({
        text: () => "Use the fallback prop to show content when the list is empty:",
        className: "docs-text"
      }),
      CodeViewer({
        code: `For({
  each: items,
  children: (item) => div({ text: item }),
  fallback: div({
    text: "No items to display",
    style: { color: "#999", fontStyle: "italic" }
  })
})`,
        language: "typescript"
      }),
      div({
        id: "show",
        text: "Show - Conditional Rendering",
        className: "docs-section-title"
      }),
      p({
        text: () => "Conditionally render components with optional fallback.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [isLoggedIn, setIsLoggedIn] = state(false)

Show({
  when: isLoggedIn,
  children: div({ text: "Welcome back!" }),
  fallback: div({ text: "Please log in" })
})`,
        language: "typescript"
      }),
      div({
        id: "switch",
        text: "Switch - Pattern Matching",
        className: "docs-section-title"
      }),
      p({
        text: () => "Match a value against multiple cases, rendering the first match. Cleaner alternative to Show-when ladders.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [status, setStatus] = state("loading")

Switch({
  on: status,
  cases: [
    { when: "loading", children: div({ text: "Loading..." }) },
    { when: "success", children: div({ text: "Data loaded!" }) },
    { when: "error", children: div({ text: "Error occurred" }) }
  ],
  fallback: div({ text: "Unknown status" })
})`,
        language: "typescript"
      }),
      p({
        text: () => "Custom matcher for complex comparisons:",
        className: "docs-text"
      }),
      CodeViewer({
        code: `const [score, setScore] = state(85)

Switch({
  on: score,
  matcher: (score, range) => score >= range.min && score <= range.max,
  cases: [
    { when: { min: 90, max: 100 }, children: div({ text: "Grade: A" }) },
    { when: { min: 80, max: 89 }, children: div({ text: "Grade: B" }) },
    { when: { min: 70, max: 79 }, children: div({ text: "Grade: C" }) }
  ],
  fallback: div({ text: "Grade: F" })
})`,
        language: "typescript"
      }),
      div({
        id: "html",
        text: "html - Raw HTML Rendering",
        className: "docs-section-title"
      }),
      p({
        text: () => "Render raw HTML content using tagged template literals. Supports both static and dynamic (reactive) content.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `// Static HTML
html\`<p>This is <strong>raw</strong> HTML content</p>\`

// Dynamic HTML with reactive state
const [name, setName] = state("Alice")
html\`<p>Hello <strong>\${name}</strong>!</p>\`

// Complex HTML with multiple dynamic values
const [count, setCount] = state(0)
html\`
  <div class="counter">
    <h2>Count: \${count}</h2>
    <p>Double: \${() => count() * 2}</p>
  </div>
\``,
        language: "typescript"
      }),
      p({
        text: () => "⚠️ Note: Be careful with user-generated content to avoid XSS vulnerabilities. Always sanitize untrusted input.",
        className: "docs-warning",
        style: { margin: "15px 0" }
      }),
      div({
        id: "html-elements",
        text: "HTML Elements",
        className: "docs-section-title"
      }),
      p({
        text: () => "Common HTML elements: div, button, p, a, ul, li",
        className: "docs-text"
      }),
      CodeViewer({
        code: `div({ 
  text: "Hello",
  style: { color: "blue" },
  className: "container",
  onClick: () => console.log("clicked"),
  children: [...]
})

a({
  href: "/about",
  text: "About",
  onClick: (e) => {
    e.preventDefault()
    router.navigate("/about")
  }
})`,
        language: "typescript"
      }),
      div({
        id: "ref",
        text: "ref - DOM Element Access",
        className: "docs-section-title"
      }),
      p({
        text: () => "Access the underlying DOM element after it's mounted. The ref callback receives the element and can optionally return a cleanup function.",
        className: "docs-text"
      }),
      CodeViewer({
        code: `// Basic usage - access element after mount
div({
  text: "Hello",
  ref: (el) => {
    console.log("Element mounted:", el)
    el.focus()
  }
})

// With cleanup - return a function to run on unmount
div({
  text: "Animated",
  ref: (el) => {
    // Setup: add animation
    const animation = el.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], { duration: 500 })
    
    // Cleanup: cancel animation on unmount
    return () => {
      animation.cancel()
    }
  }
})

// Real-world example: syntax highlighting
div({
  text: code,
  ref: (el) => {
    const cleanup = applySyntaxHighlighting(el, code)
    return cleanup
  }
})`,
        language: "typescript"
      }),
      p({
        text: () => "The ref callback is called after the element is added to the DOM, ensuring you can safely interact with it. The cleanup function (if returned) is called when the component unmounts.",
        className: "docs-text"
      })
    ]
  })
}
