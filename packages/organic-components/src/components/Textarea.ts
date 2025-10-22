import { html } from "organic-ui/components"
import { cn } from "../lib/utils.js"

export interface TextareaProps {
  class?: string
  placeholder?: string
  value?: string
  onInput?: (value: string) => void
  disabled?: boolean
  rows?: number
}

export function Textarea({
  class: className,
  value,
  onInput,
  ...props
}: TextareaProps) {
  return html`<textarea class="${cn(
    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}" ${value ? `value="${value}"` : ""} oninput="this.dispatchEvent(new CustomEvent('input', {detail: this.value}))" ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}></textarea>`
}
