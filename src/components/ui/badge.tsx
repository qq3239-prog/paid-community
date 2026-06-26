import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-[11px] font-semibold tracking-[0.06em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-[var(--ink)]",
        secondary: "border-[var(--hair-2)] bg-transparent text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-[var(--hair-2)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
        success: "border-transparent bg-[var(--accent)] text-[var(--ink)] font-bold",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
