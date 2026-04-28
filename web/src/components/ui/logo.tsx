import * as React from "react"
import { cn } from "@/lib/utils"

type LogoProps = {
  size?: number
  color?: string       // brand color (default chili-500)
  textColor?: string
  showText?: boolean
  className?: string
}

export function Logo({
  size = 48,
  color = "var(--chili-500)",
  textColor = "var(--ink-700)",
  showText = true,
  className,
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* speech bubble */}
        <path
          d="M24 4 C36 4 44 12 44 22 C44 32 36 40 24 40 L16 40 L8 46 L10 38 C6 34 4 28 4 22 C4 12 12 4 24 4 Z"
          fill={color}
        />
        <text
          x="18"
          y="28"
          fill="white"
          fontSize="18"
          fontWeight="900"
          fontFamily="var(--font-display-stack)"
          style={{ letterSpacing: -1 }}
        >
          ¡!
        </text>
      </svg>
      {showText && (
        <span
          className="font-marker leading-none"
          style={{ fontSize: size * 0.56, color: textColor, letterSpacing: -0.5 }}
        >
          ¿Qué Pedo<span style={{ color }}>!</span>
        </span>
      )}
    </div>
  )
}
