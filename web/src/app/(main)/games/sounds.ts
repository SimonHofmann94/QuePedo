"use client"

// Synthesized game audio — Web Audio oscillators, zero asset files.
// The context starts suspended by browser policy: call initAudio() from a
// user gesture (ReadyCard's ¡Dale! / replay buttons do this). Every player
// is a no-op until then, and everything is try/catch — audio can never
// break a game.

let ctx: AudioContext | null = null

export function initAudio(): void {
  try {
    if (typeof window === "undefined") return
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    if (ctx.state === "suspended") void ctx.resume()
  } catch {
    ctx = null
  }
}

/** One enveloped oscillator note. Times are relative to now (seconds). */
function note(
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType = "triangle",
  peak = 0.12,
): void {
  if (!ctx || ctx.state !== "running") return
  try {
    const t0 = ctx.currentTime + startAt
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    // Fast attack, exponential decay — reads as a "blip", not a beep.
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
  } catch {
    /* never let audio throw into game code */
  }
}

const C5 = 523.25
const E5 = 659.25
const G5 = 783.99
const C6 = 1046.5

/** Correct answer: rising major third. */
export function playCorrect(): void {
  note(C5, 0, 0.12)
  note(E5, 0.08, 0.16)
}

/** Wrong/miss: short low buzz. */
export function playWrong(): void {
  note(116.54, 0, 0.22, "square", 0.08) // Bb2
}

/** Combo blip — pitch climbs with the multiplier (level 1..5+). */
export function playCombo(level: number): void {
  const semitones = Math.min(Math.max(level, 1), 8) * 2
  note(C5 * Math.pow(2, semitones / 12), 0, 0.1, "triangle", 0.1)
}

/** Celebration fanfare: fast ascending arpeggio (¡LOTERÍA!, nuevo récord). */
export function playFanfare(): void {
  note(C5, 0, 0.14)
  note(E5, 0.09, 0.14)
  note(G5, 0.18, 0.14)
  note(C6, 0.27, 0.3, "triangle", 0.14)
}

/** Small neutral tick: tile placed, card called. */
export function playTick(): void {
  note(880, 0, 0.05, "sine", 0.06)
}
