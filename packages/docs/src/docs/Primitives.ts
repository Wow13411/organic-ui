import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function Primitives() {
  return div({
    children: [
      div({
        text: "Rendering Primitives",
        class: "docs-page-title"
      }),
      p({
        text: "organic-ui provides powerful rendering primitives for conditional rendering, list rendering, and direct HTML manipulation.",
        class: "docs-text"
      }),

      div({
        id: "show",
        text: "Show",
        class: "docs-section-title"
      }),
      p({
        text: "The Show component conditionally renders content based on a reactive condition. It efficiently updates when the condition changes.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { Show } from "organic-ui/components"
import { state } from "organic-ui/reactivity"

const [isVisible, setIsVisible] = state(true)

Show({
  when: isVisible,
  children: div({
    text: "This content is conditionally rendered"
  })
})`,
        language: "typescript"
      }),
      p({
        text: "The Show component also supports a fallback for when the condition is false:",
        class: "docs-text"
      }),
      CodeViewer({
        code: `Show({
  when: isLoggedIn,
  children: div({ text: "Welcome back!" }),
  fallback: div({ text: "Please log in" })
})`,
        language: "typescript"
      }),

      div({
        id: "for",
        text: "For",
        class: "docs-section-title"
      }),
      p({
        text: "The For component efficiently renders lists of items with fine-grained reactivity. It only updates the specific items that change.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { For } from "organic-ui/components"
import { state } from "organic-ui/reactivity"

const [items, setItems] = state(['Apple', 'Banana', 'Cherry'])

For({
  each: items,
  children: (item, index) => div({
    text: \`\${index() + 1}. \${item}\`
  })
})`,
        language: "typescript"
      }),
      p({
        text: "Use the key prop for efficient reconciliation when items can be reordered:",
        class: "docs-text"
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
        text: "Use the fallback prop to show content when the list is empty:",
        class: "docs-text"
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
        id: "switch",
        text: "Switch",
        class: "docs-section-title"
      }),
      p({
        text: "The Switch component renders content based on matching a value against multiple cases, similar to a switch statement. It evaluates cases in order and renders the first matching case.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { Switch } from "organic-ui/components"
import { state } from "organic-ui/reactivity"

const [status, setStatus] = state('loading')

Switch({
  on: status,
  cases: [
    { when: 'loading', children: div({ text: "Loading..." }) },
    { when: 'error', children: div({ text: "Error occurred" }) },
    { when: 'success', children: div({ text: "Success!" }) }
  ]
})`,
        language: "typescript"
      }),
      p({
        text: "You can provide a fallback that renders when no cases match:",
        class: "docs-text"
      }),
      CodeViewer({
        code: `const [value, setValue] = state(5)

Switch({
  on: value,
  cases: [
    { when: 10, children: div({ text: "Value is 10" }) },
    { when: 20, children: div({ text: "Value is 20" }) }
  ],
  fallback: div({ text: "Value is something else" })
})`,
        language: "typescript"
      }),
      p({
        text: "You can also provide a custom matcher function for complex comparisons:",
        class: "docs-text"
      }),
      CodeViewer({
        code: `Switch({
  on: value,
  matcher: (onValue, matchValue) => onValue > matchValue,
  cases: [
    { when: 100, children: div({ text: "Greater than 100" }) },
    { when: 50, children: div({ text: "Greater than 50" }) },
    { when: 0, children: div({ text: "Greater than 0" }) }
  ],
  fallback: div({ text: "Zero or negative" })
})`,
        language: "typescript"
      }),

      div({
        id: "html",
        text: "html",
        class: "docs-section-title"
      }),
      p({
        text: "The html function allows you to render raw HTML strings directly. This is useful for integrating with external HTML content or when you need more control over the markup.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { html } from "organic-ui/components"

html\`<div class="custom-component">
  <h1>Raw HTML Content</h1>
  <p>This is rendered directly as HTML</p>
</div>\``,
        language: "typescript"
      }),
      p({
        text: "You can interpolate values into the HTML string:",
        class: "docs-text"
      }),
      CodeViewer({
        code: `const title = "Dynamic Title"
const content = "Dynamic content"

html\`<article>
  <h2>\${title}</h2>
  <p>\${content}</p>
</article>\``,
        language: "typescript"
      }),
      p({
        text: "Note: Be careful when using html with user-generated content to avoid XSS vulnerabilities. Always sanitize user input before rendering it as HTML.",
        class: "docs-text"
      }),

      div({
        id: "html-elements",
        text: "HTML Elements",
        class: "docs-section-title"
      }),
      p({
        text: "organic-ui provides functions for common HTML elements like div, button, p, a, ul, li, and more. These functions accept props for styling, event handlers, and children.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { div, button, p, a } from "organic-ui/components"

div({ 
  text: "Hello",
  style: { color: "blue" },
  class: "container",
  onClick: () => console.log("clicked"),
  children: [...]
})

button({
  text: "Click me",
  onClick: () => console.log("clicked")
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
        class: "docs-section-title"
      }),
      p({
        text: "Access the underlying DOM element after it's mounted. The ref callback receives the element and can optionally return a cleanup function.",
        class: "docs-text"
      }),
      CodeViewer({
        code: `import { div } from "organic-ui/components"

// Basic usage - access element after mount
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
        text: "The ref callback is called after the element is added to the DOM, ensuring you can safely interact with it. The cleanup function (if returned) is called when the component unmounts.",
        class: "docs-text"
      }),

      div({
        id: "best-practices",
        text: "Best Practices",
        class: "docs-section-title"
      }),
      div({
        class: "docs-list",
        children: [
          p({ text: "• Use Show for simple conditional rendering of a single element or component" }),
          p({ text: "• Use Switch when you have multiple mutually exclusive conditions to match against a value" }),
          p({ text: "• Use For for rendering lists - it provides efficient updates and proper keying" }),
          p({ text: "• Avoid using html with unsanitized user input to prevent XSS attacks" }),
          p({ text: "• Prefer component functions over html when possible for better type safety" }),
          p({ text: "• Use reactive getters (functions) for conditions in Show and Switch to enable automatic updates" }),
          p({ text: "• Use the key prop in For when items can be reordered for better performance" }),
          p({ text: "• Use ref for DOM manipulation that can't be done declaratively" })
        ]
      })
    ]
  })
}
