import { cva } from "cva"
import { div, button } from "organic-ui/components"
import { cn } from "../lib/utils.js"

const collapsibleVariants = cva({
  base: "grid w-full gap-2",
  variants: {},
  defaultVariants: {}
})

export interface CollapsibleProps {
  class?: string
  children?: any
  open?: boolean
}

function CollapsibleRoot({
  class: className,
  children,
  open,
  ...props
}: CollapsibleProps) {
  return div({
    class: cn(collapsibleVariants(), className),
    children,
    ...props
  })
}

export interface CollapsibleTriggerProps {
  class?: string
  children?: any
  onClick: () => void
}

export function CollapsibleTrigger({
  class: className,
  children,
  onClick,
  ...props
}: CollapsibleTriggerProps) {
  return button({
    class: cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-90", className),
    onClick,
    children,
    ...props
  })
}

export interface CollapsibleContentProps {
  class?: string
  children?: any
  open?: boolean
}

export function CollapsibleContent({
  class: className,
  children,
  open,
  ...props
}: CollapsibleContentProps) {
  if (!open) return null

  return div({
    class: cn("overflow-hidden text-sm transition-all", className),
    children,
    ...props
  })
}

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent
}
