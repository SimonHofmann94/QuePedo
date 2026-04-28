// ¡Qué Pedo! cultural motif components: PapelPicado, TalaveraTile, Sunburst, ChiliMascot.
// Use sparingly as section dividers, watermarks, hero backgrounds, celebratory moments.
import * as React from "react"

const c = (name: string) => `var(--${name})`

type PapelPicadoProps = {
  height?: number
  className?: string
  colors?: string[]
}

export function PapelPicado({ height = 60, className, colors }: PapelPicadoProps) {
  const pal = colors ?? [
    c("chili-500"),
    c("rosa-500"),
    c("jade-500"),
    c("cielo-500"),
    c("maiz-400"),
    c("jacaranda-500"),
  ]
  return (
    <svg
      viewBox="0 0 600 120"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <line x1="0" y1="8" x2="600" y2="8" stroke={c("ink-400")} strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = i * 75 + 10
        const col = pal[i % pal.length]
        return (
          <g key={i} transform={`translate(${x}, 8)`}>
            <path d="M0 0 L60 0 L60 60 L30 90 L0 60 Z" fill={col} />
            <circle cx="15" cy="20" r="4" fill="white" />
            <circle cx="45" cy="20" r="4" fill="white" />
            <path d="M20 35 L40 35 L30 50 Z" fill="white" />
            <circle cx="30" cy="65" r="3" fill="white" />
            <path
              d="M5 60 L5 70 M15 60 L15 72 M25 60 L25 74 M35 60 L35 74 M45 60 L45 72 M55 60 L55 70"
              stroke={col}
              strokeWidth="2"
            />
          </g>
        )
      })}
    </svg>
  )
}

export function TalaveraTile({ size = 180, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <rect width="100" height="100" fill={c("cielo-50")} />
      <circle cx="50" cy="50" r="8" fill={c("chili-500")} />
      <circle cx="50" cy="50" r="4" fill={c("maiz-300")} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <ellipse cx="50" cy="30" rx="5" ry="12" fill={c("cielo-500")} />
        </g>
      ))}
      {[
        [10, 10],
        [90, 10],
        [10, 90],
        [90, 90],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill={c("jacaranda-400")} />
          <circle cx={x} cy={y} r="2" fill="white" />
        </g>
      ))}
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={c("cielo-600")} strokeWidth="1.5" />
      <rect x="6" y="6" width="88" height="88" fill="none" stroke={c("cielo-300")} strokeWidth="0.5" />
    </svg>
  )
}

export function Sunburst({ size = 200, color, className }: { size?: number; color?: string; className?: string }) {
  const fill = color ?? c("maiz-400")
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className}>
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d="M0 -20 L3 -45 L-3 -45 Z" fill={fill} transform={`rotate(${i * 22.5})`} />
      ))}
      <circle r="18" fill={c("chili-500")} />
      <circle r="14" fill={c("chili-400")} />
      <circle cx="-5" cy="-3" r="1.5" fill={c("ink-800")} />
      <circle cx="5" cy="-3" r="1.5" fill={c("ink-800")} />
      <path d="M-5 4 Q0 8 5 4" stroke={c("ink-800")} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function ChiliMascot({ size = 180, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 120" className={className}>
      <path d="M50 15 Q48 5 55 8 Q58 3 62 10 Q65 6 62 15 Q55 18 50 15Z" fill={c("jade-600")} />
      <path
        d="M45 20 Q30 30 35 70 Q40 105 55 95 Q75 85 70 45 Q68 22 55 20 Q50 18 45 20Z"
        fill={c("chili-500")}
      />
      <path d="M40 35 Q38 50 42 65" stroke={c("chili-300")} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="55" r="3" fill={c("ink-900")} />
      <circle cx="62" cy="55" r="3" fill={c("ink-900")} />
      <circle cx="48" cy="54" r="1" fill="white" />
      <circle cx="62" cy="54" r="1" fill="white" />
      <path d="M48 65 Q55 72 62 65" stroke={c("ink-900")} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="63" r="3" fill={c("rosa-300")} opacity="0.6" />
      <circle cx="68" cy="63" r="3" fill={c("rosa-300")} opacity="0.6" />
    </svg>
  )
}
