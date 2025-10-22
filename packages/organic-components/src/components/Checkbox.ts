import { html } from "organic-ui/components"
import { cn } from "../lib/utils.js"

export interface CheckboxProps {
  class?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
}

export function Checkbox({
  class: className,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return html`<input type="checkbox" class="${cn(
    "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    checked ? "bg-primary text-primary-foreground" : "",
    className
  )}" ${checked ? "checked" : ""} onchange="this.dispatchEvent(new CustomEvent('change', {detail: this.checked}))" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")} />`
}
