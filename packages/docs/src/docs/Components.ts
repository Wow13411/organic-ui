import { div, p } from "organic-ui/components"
import { CodeViewer } from "../components/CodeViewer.js"

export function Components() {

  return div({
    children: [
      div({
        text: "Components",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2c3e50"
        }
      }),
      div({
        id: "for",
        text: "For - List Rendering",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Render dynamic lists that automatically update when the array changes.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
      div({
        id: "show",
        text: "Show - Conditional Rendering",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Conditionally render components with optional fallback.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Match a value against multiple cases, rendering the first match. Cleaner alternative to Show-when ladders.",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
        style: { marginTop: "20px", marginBottom: "15px", lineHeight: "1.6" }
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
        id: "html-elements",
        text: "HTML Elements",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "30px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      p({
        text: () => "Common HTML elements: div, button, p, a, ul, li",
        style: { marginBottom: "15px", lineHeight: "1.6" }
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
      })
    ]
  })
}
