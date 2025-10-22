import { div, p } from "organic-ui/components"

export function Introduction() {
  return div({
    children: [
      div({
        text: "Introduction",
        class: "docs-page-title"
      }),
      p({
        text: "organic-ui is a lightweight reactive UI framework with fine-grained reactivity and declarative components.",
        class: "docs-intro-text"
      }),
      div({
        id: "features",
        text: "Features",
        class: "docs-section-title"
      }),
      div({
        class: "docs-list",
        children: [
          p({
            text: "• Fine-grained reactivity - Efficient updates with reactive state",
            class: "docs-list-item"
          }),
          p({
            text: "• Declarative components - Compose UIs with simple functions",
            class: "docs-list-item"
          }),
          p({
            text: "• Zero dependencies - Pure TypeScript implementation",
            class: "docs-list-item"
          }),
          p({
            text: "• Tiny footprint - Minimal runtime overhead",
            class: "docs-list-item"
          })
        ]
      }),
      div({
        id: "philosophy",
        text: "Philosophy",
        class: "docs-section-title"
      }),
      p({
        text: "organic-ui provides reactive primitives (state, effect, For, Show) and common HTML elements. For specialized elements or complex UI patterns, create custom components or use a component library built on organic-ui. The framework focuses on being a solid foundation rather than a complete UI toolkit.",
        class: "docs-text"
      })
    ]
  })
}
