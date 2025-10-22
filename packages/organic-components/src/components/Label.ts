import { div } from "organic-ui/components"
import { cn } from "../lib/utils.js"

export interface LabelProps {
  class?: string
  children?: any
  htmlFor?: string
}

export function Label({
  class: className,
  children,
  ...props
}: LabelProps) {
  const divProps: any = {
    class: cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    ),
    ...props
  }
  
  // Handle string children
  if (typeof children === 'string') {
    divProps.text = children
  } else if (children) {
    divProps.children = Array.isArray(children) ? children : [children]
  }
  
  return div(divProps)
}
