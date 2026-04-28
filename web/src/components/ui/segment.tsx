"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Option<T extends string> = { value: T; label: React.ReactNode }

type SegmentProps<T extends string> = {
  options: Option<T>[]
  value: T
  onChange?: (value: T) => void
  className?: string
}

export function Segment<T extends string>({ options, value, onChange, className }: SegmentProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex gap-0.5 rounded-[12px] bg-ink-100 p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange?.(o.value)}
            className={cn(
              "rounded-[9px] border-0 px-4 py-2 text-[13px] font-semibold font-body transition-all",
              active
                ? "bg-white text-ink-800 shadow-[0_1px_2px_rgba(0,0,0,.08)]"
                : "bg-transparent text-ink-500 hover:text-ink-700",
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
