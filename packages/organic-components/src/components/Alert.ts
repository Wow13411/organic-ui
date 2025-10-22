import { cva, type VariantProps } from "cva"
import { div } from "organic-ui/components"
import { cn } from "../lib/utils.js"

const alertVariants = cva({
  base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive:
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface AlertProps extends VariantProps<typeof alertVariants> {
  class?: string
  children?: any
}

function AlertRoot({
  class: className,
  variant,
  children,
  ...props
}: AlertProps) {
  return div({
    class: cn(alertVariants({ variant }), className),
    children,
    ...props
  })
}

export interface AlertTitleProps {
  class?: string
  children?: any
}

export function AlertTitle({
  class: className,
  children,
  ...props
}: AlertTitleProps) {
  return div({
    class: cn("mb-1 font-medium leading-none tracking-tight", className),
    children,
    ...props
  })
}

export interface AlertDescriptionProps {
  class?: string
  children?: any
}

export function AlertDescription({
  class: className,
  children,
  ...props
}: AlertDescriptionProps) {
  return div({
    class: cn("text-sm [&_p]:leading-relaxed", className),
    children,
    ...props
  })
}

export const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription
}
