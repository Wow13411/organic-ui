# organic-ui

A lightweight reactive UI framework with fine-grained reactivity and declarative components.

## Features

- **Fine-grained reactivity** - Efficient updates with reactive state
- **Declarative components** - Compose UIs with simple functions
- **Zero dependencies** - Pure TypeScript implementation
- **Tiny footprint** - Minimal runtime overhead

## Structure

```
packages/
  organic-ui/     # Core framework
  demo/           # Example application
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Run demo
pnpm dev
```

## Example

```typescript
import { render } from "organic-ui/renderer"
import { state } from "organic-ui/reactivity"
import { div, button, p } from "organic-ui/components"

function Counter({ label }) {
  const [count, setCount] = state(0)

  return div({
    children: [
      p({ text: () => `${label}: ${count()}` }),
      button({ text: () => "+", onClick: () => setCount(count() + 1) })
    ]
  })
}

// Mount to DOM
const root = document.getElementById("app")!
render(() => [Counter({ label: "Clicks" })], root)
```

## License

MIT
