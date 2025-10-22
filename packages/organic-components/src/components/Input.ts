import { input } from "organic-ui/components"
import { cn } from "../lib/utils.js"

export interface InputProps {
  class?: string
  type?: string
  placeholder?: string
  value?: string | number | (() => string | number)
  onInput?: (value: string) => void
  disabled?: boolean
}

export function Input({
  class: className,
  ...props
}: InputProps) {
  return input({
    class: cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props
  })
}
