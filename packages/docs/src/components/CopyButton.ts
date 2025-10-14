import { div, html, button } from "organic-ui/components"
import { state } from "organic-ui/reactivity"

export function CopyButton(code: string) {
  const [buttonText, setButtonText] = state("Copy")
  const [buttonBg, setButtonBg] = state("#3b82f6")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setButtonText("✓ Copied!")
      setButtonBg("#10b981")
      setTimeout(() => {
        setButtonText("Copy")
        setButtonBg("#3b82f6")
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return div({
    children: [
      html`
        <style>
          .code-copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            opacity: 0.9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .code-copy-button:hover {
            opacity: 1;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
          }
        </style>
      `,
      button({
        text: buttonText,
        onClick: handleCopy,
        className: "code-copy-button",
        style: () => ({ background: buttonBg() })
      })
    ]
  })
}
