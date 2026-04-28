import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ¡Qué Pedo! badge — uppercase mono, full-radius, three intensities (solid/soft/outline)
// across all 7 color families (chili / rosa / jade / cielo / maiz / jacaranda / ink).
const badgeVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-1 rounded-full font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 w-fit",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
    "transition-colors overflow-hidden",
  ),
  {
    variants: {
      color: {
        chili:     "",
        rosa:      "",
        jade:      "",
        cielo:     "",
        maiz:      "",
        jacaranda: "",
        ink:       "",
      },
      variant: {
        solid:   "",
        soft:    "",
        outline: "border-[1.5px] bg-transparent",
      },
      size: {
        sm: "px-2 py-[3px] text-[10px]",
        md: "px-2.5 py-[5px] text-[11px]",
        lg: "px-3.5 py-[7px] text-[13px]",
      },
      // Shadcn-compat
      shape: {
        default:     "border-transparent bg-chili-500 text-white",
        secondary:   "border-transparent bg-ink-700 text-white",
        destructive: "border-transparent bg-rosa-500 text-white",
        muted:       "border-transparent bg-ink-100 text-ink-700",
      },
    },
    compoundVariants: [
      // Solid combinations
      { color: "chili",     variant: "solid", className: "bg-chili-500 text-white" },
      { color: "rosa",      variant: "solid", className: "bg-rosa-500 text-white" },
      { color: "jade",      variant: "solid", className: "bg-jade-500 text-white" },
      { color: "cielo",     variant: "solid", className: "bg-cielo-500 text-white" },
      { color: "maiz",      variant: "solid", className: "bg-maiz-400 text-ink-800" },
      { color: "jacaranda", variant: "solid", className: "bg-jacaranda-500 text-white" },
      { color: "ink",       variant: "solid", className: "bg-ink-700 text-white" },
      // Soft
      { color: "chili",     variant: "soft", className: "bg-chili-100 text-chili-700" },
      { color: "rosa",      variant: "soft", className: "bg-rosa-100 text-rosa-700" },
      { color: "jade",      variant: "soft", className: "bg-jade-100 text-jade-700" },
      { color: "cielo",     variant: "soft", className: "bg-cielo-100 text-cielo-700" },
      { color: "maiz",      variant: "soft", className: "bg-maiz-100 text-maiz-700" },
      { color: "jacaranda", variant: "soft", className: "bg-jacaranda-100 text-jacaranda-700" },
      { color: "ink",       variant: "soft", className: "bg-ink-100 text-ink-700" },
      // Outline
      { color: "chili",     variant: "outline", className: "border-chili-300 text-chili-600" },
      { color: "rosa",      variant: "outline", className: "border-rosa-300 text-rosa-600" },
      { color: "jade",      variant: "outline", className: "border-jade-300 text-jade-600" },
      { color: "cielo",     variant: "outline", className: "border-cielo-300 text-cielo-600" },
      { color: "maiz",      variant: "outline", className: "border-maiz-300 text-maiz-600" },
      { color: "jacaranda", variant: "outline", className: "border-jacaranda-300 text-jacaranda-600" },
      { color: "ink",       variant: "outline", className: "border-ink-300 text-ink-600" },
    ],
    defaultVariants: {
      color: "chili",
      variant: "solid",
      size: "md",
    },
  }
)

function Badge({
  className,
  color,
  variant,
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  // If `shape` is passed (legacy shadcn variant prop), use it; else use color/variant.
  if (shape) {
    return (
      <Comp
        data-slot="badge"
        className={cn(badgeVariants({ size, shape }), className)}
        {...props}
      />
    )
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ color, variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
