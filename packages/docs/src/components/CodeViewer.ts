import { div } from "organic-ui/components"

interface CodeViewerProps {
  code: string
  language?: string
}

export function CodeViewer({ code, language = "typescript" }: CodeViewerProps) {
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
    children: [
      div({
        text: code,
        style: {
          color: "#2c3e50"
        }
      })
    ]
  })
}
