"use client"

// Shared game-feel primitives: papel-picado burst, screen shake, count-up.
// All motion respects prefers-reduced-motion via useReducedMotion().

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

// ── Reduced motion ───────────────────────────────────────────────────────

const RM_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeRM,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  )
}

// ── Papel-picado burst ───────────────────────────────────────────────────

const PAPEL_COLORS = [
  "var(--chili-500)",
  "var(--rosa-500)",
  "var(--jade-500)",
  "var(--cielo-500)",
  "var(--maiz-400)",
  "var(--jacaranda-500)",
]

/**
 * Confetti burst of papel-picado snippets. Fire it by incrementing `trigger`
 * (0 = idle). Stateless: particles are keyed by `trigger`, animate once with
 * `forwards` fill, and rest invisible until the next trigger remounts them.
 * Position: fills its nearest positioned ancestor.
 */
export function Burst({ trigger, count = 24 }: { trigger: number; count?: number }) {
  const reduced = useReducedMotion()

  if (!trigger || reduced) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes papel-fall {
          0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.6); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const dist = 60 + (i % 5) * 28
        const style = {
          left: "50%",
          top: "40%",
          width: i % 3 === 0 ? 10 : 7,
          height: i % 2 === 0 ? 12 : 8,
          background: PAPEL_COLORS[i % PAPEL_COLORS.length],
          "--dx": `${Math.cos(angle) * dist}px`,
          "--dy": `${Math.sin(angle) * dist + 120}px`,
          "--rot": `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
          animation: `papel-fall ${0.9 + (i % 4) * 0.15}s ease-out forwards`,
        } as React.CSSProperties
        return <span key={`${trigger}-${i}`} className="absolute rounded-[2px]" style={style} />
      })}
    </div>
  )
}

// ── Screen shake ─────────────────────────────────────────────────────────

/** Wrap the play field; bump `trigger` to shake it (miss, wrong tap). */
export function Shake({ trigger, children }: { trigger: number; children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <div
      key={reduced ? 0 : trigger}
      style={trigger > 0 && !reduced ? { animation: "juice-shake 0.35s ease-in-out" } : undefined}
    >
      <style>{`
        @keyframes juice-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
      {children}
    </div>
  )
}

// ── Count-up number ──────────────────────────────────────────────────────

/** Animates 0 → `to` (score tallies). Renders the final value directly when
 *  reduced motion is on — all setState happens inside rAF callbacks. */
export function CountUp({ to, durationMs = 900 }: { to: number; durationMs?: number }) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (reduced) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1)
      // ease-out cubic — fast start, satisfying settle
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [to, durationMs, reduced])

  return <>{reduced ? to : value}</>
}
