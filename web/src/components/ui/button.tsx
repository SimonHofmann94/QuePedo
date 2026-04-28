import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ¡Qué Pedo! chunky button — signature press-down feel.
// Active: translate-y-1 + shadow-none → physical "click".
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-bold tracking-wide",
    "rounded-[14px] transition-[transform,box-shadow,background-color] duration-100",
    "active:translate-y-1 active:shadow-none",
    "disabled:pointer-events-none disabled:bg-ink-200 disabled:text-ink-400 disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "outline-none focus-visible:ring-4 focus-visible:ring-chili-200/60",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-chili-500 text-white hover:bg-chili-600 shadow-[0_4px_0_0_var(--chili-700)]",
        secondary:
          "bg-ink-700 text-white hover:bg-ink-600 shadow-[0_4px_0_0_var(--ink-900)]",
        success:
          "bg-jade-500 text-white hover:bg-jade-600 shadow-[0_4px_0_0_var(--jade-700)]",
        danger:
          "bg-rosa-500 text-white hover:bg-rosa-600 shadow-[0_4px_0_0_var(--rosa-700)]",
        outline:
          "bg-white text-chili-600 border-2 border-chili-300 hover:bg-chili-50 shadow-[0_4px_0_0_var(--chili-200)]",
        ghost:
          "bg-transparent text-ink-700 border-2 border-ink-200 hover:bg-ink-100 shadow-none active:translate-y-0",
        link:
          "bg-transparent text-chili-600 underline-offset-4 hover:underline shadow-none active:translate-y-0 px-0",
        // Aliases for shadcn migration
        default:
          "bg-chili-500 text-white hover:bg-chili-600 shadow-[0_4px_0_0_var(--chili-700)]",
        destructive:
          "bg-rosa-500 text-white hover:bg-rosa-600 shadow-[0_4px_0_0_var(--rosa-700)]",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] gap-1.5",
        md: "h-[46px] px-5 text-[15px] gap-2",
        lg: "h-14 px-7 text-[17px] gap-2.5",
        icon: "h-[46px] w-[46px] p-0",
        "icon-sm": "h-9 w-9 p-0",
        "icon-lg": "h-14 w-14 p-0",
        // Alias for shadcn migration
        default: "h-[46px] px-5 text-[15px] gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
