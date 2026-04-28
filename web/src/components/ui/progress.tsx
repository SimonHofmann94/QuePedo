import * as React from "react"
import { cn } from "@/lib/utils"

type ProgressBarProps = {
  value: number
  max?: number
  color?: string         // CSS color (e.g. var(--chili-500))
  trackColor?: string
  height?: number
  label?: React.ReactNode
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  color = "var(--chili-500)",
  trackColor = "var(--ink-100)",
  height = 10,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn("w-full", className)}>
      {label !== undefined && (
        <div className="mb-1.5 flex justify-between font-mono text-[11px] font-semibold text-ink-500">
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div
        className="overflow-hidden rounded-full"
        style={{ background: trackColor, height, boxShadow: "inset 0 1px 2px rgba(0,0,0,.06)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: "inset 0 -3px 0 rgba(0,0,0,.12)",
          }}
        />
      </div>
    </div>
  )
}

type ProgressRingProps = {
  value: number
  max?: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  children?: React.ReactNode
  className?: string
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  stroke = 8,
  color = "var(--chili-500)",
  trackColor = "var(--ink-100)",
  children,
  className,
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value / max))
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - c * pct}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s" }}
        />
      </svg>
      {children !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-ink-800">
          {children}
        </div>
      )}
    </div>
  )
}
