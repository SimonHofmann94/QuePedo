import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-[12px] border-2 border-ink-200 bg-white px-3.5 py-2",
        "font-body text-[15px] text-ink-800 placeholder:text-ink-400",
        "transition-[border-color,box-shadow] outline-none",
        "focus-visible:border-chili-400 focus-visible:ring-4 focus-visible:ring-chili-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-rosa-400 aria-invalid:ring-rosa-100",
        "file:inline-flex file:h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
