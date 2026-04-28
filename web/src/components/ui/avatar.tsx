import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarProps = {
  name?: string
  emoji?: string
  color?: string  // CSS color (e.g. var(--chili-500))
  size?: number
  className?: string
}

export function Avatar({
  name = "?",
  emoji,
  color = "var(--chili-500)",
  size = 48,
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-extrabold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.42,
        boxShadow: "inset 0 -4px 0 rgba(0,0,0,.15), 0 2px 0 rgba(0,0,0,.1)",
      }}
    >
      {emoji ?? name.charAt(0).toUpperCase()}
    </div>
  )
}
