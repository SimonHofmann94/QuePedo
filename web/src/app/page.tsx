import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import { PapelPicado } from "@/components/ui/motifs"
import { ArrowIcon, PlayIcon } from "@/components/ui/icons"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--surface-bg)] font-body">
      {/* Papel picado banner */}
      <div className="absolute inset-x-0 top-0 z-10 h-[60px]">
        <PapelPicado height={60} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-20 md:px-14">
        <Logo size={44} />
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="#" className="hidden text-sm font-semibold text-ink-600 hover:text-ink-800 sm:block">
            Cómo Funciona
          </Link>
          <Link href="#" className="hidden text-sm font-semibold text-ink-600 hover:text-ink-800 sm:block">
            Cultura
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">¡Empieza Gratis!</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-14 md:py-16">
        <div>
          <Badge color="maiz" variant="soft" size="lg">
            🌶 Spanish que de verdad pega
          </Badge>
          <h1 className="mt-5 font-display text-[56px] font-extrabold leading-[0.92] tracking-[-0.035em] text-ink-900 md:text-[88px]">
            Habla como{" "}
            <span className="font-marker font-normal text-chili-500">chingón</span>
            , no como libro de texto.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500 md:text-[19px]">
            Real slang, real cultura, real conversaciones. Aprende el español que
            la gente habla de verdad — en el mercado, en la cantina y en la mesa
            de la abuela.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                ¡Dale, empezar!
                <ArrowIcon size={18} />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <PlayIcon size={16} />
              Ver demo
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex">
              {([
                ["var(--chili-500)", "A"],
                ["var(--jade-500)", "M"],
                ["var(--cielo-500)", "L"],
                ["var(--jacaranda-500)", "D"],
                ["var(--rosa-500)", "S"],
              ] as const).map(([bg, ch], i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white font-display text-[13px] font-bold text-white"
                  style={{ background: bg, marginLeft: i === 0 ? 0 : -10 }}
                >
                  {ch}
                </div>
              ))}
            </div>
            <div>
              <div className="font-display text-lg font-extrabold text-ink-800">
                47.000+ colegas
              </div>
              <div className="text-xs text-ink-500">aprendiendo con nosotros ahora</div>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative h-[420px] md:h-[520px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, var(--maiz-100), var(--chili-50) 60%, transparent)",
            }}
          />
          <MercadoScene />

          <div className="absolute right-[-12px] top-12 rotate-6">
            <FloatingWordCard term="¡Órale!" de="¡Wow / Ándale!" tag="interjection" color="chili" />
          </div>
          <div className="absolute bottom-12 left-[-16px] -rotate-3">
            <FloatingWordCard term="la chamba" de="el trabajo" tag="slang · MX" color="jade" />
          </div>
          <div className="absolute left-4 top-44 -rotate-6 flex items-center gap-2.5 rounded-2xl border-2 border-maiz-300 bg-white p-3 shadow-lg">
            <div className="text-2xl">🔥</div>
            <div>
              <div className="font-display text-lg font-extrabold leading-none text-ink-800">Racha +1</div>
              <div className="text-[11px] text-ink-500">14 días · ¡chingón!</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-ink-100 px-6 py-8 md:px-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 font-mono text-xs text-ink-400">
          <span>© 2026 ¡Qué Pedo! · Hecho con 🌶 en CDMX</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink-700">Privacidad</Link>
            <Link href="/terms" className="hover:text-ink-700">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FloatingWordCard({
  term,
  de,
  tag,
  color = "chili",
}: {
  term: string
  de: string
  tag: string
  color?: "chili" | "jade" | "cielo"
}) {
  const map = {
    chili: { bg: "bg-chili-50", border: "border-chili-300" },
    jade: { bg: "bg-jade-50", border: "border-jade-300" },
    cielo: { bg: "bg-cielo-50", border: "border-cielo-300" },
  }[color]
  return (
    <div className={`min-w-[180px] rounded-2xl border-2 ${map.border} ${map.bg} p-4 shadow-lg`}>
      <Badge color="jacaranda" variant="soft" size="sm">{tag}</Badge>
      <div className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-tight text-ink-800">
        {term}
      </div>
      <div className="mt-1 text-xs text-ink-500">{de}</div>
    </div>
  )
}

function MercadoScene() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-10">
      <circle cx="200" cy="180" r="90" fill="var(--maiz-300)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
        <path
          key={a}
          d="M200 70 L205 40 L195 40 Z"
          fill="var(--maiz-400)"
          transform={`rotate(${a} 200 180)`}
        />
      ))}
      <rect x="60" y="170" width="90" height="160" fill="var(--chili-400)" rx="4" />
      <rect x="250" y="150" width="100" height="180" fill="var(--rosa-400)" rx="4" />
      <rect x="155" y="190" width="90" height="140" fill="var(--cielo-400)" rx="4" />
      <rect x="90" y="250" width="30" height="80" fill="var(--ink-800)" rx="2" />
      <rect x="275" y="220" width="50" height="110" fill="var(--ink-800)" rx="2" />
      <rect x="180" y="230" width="40" height="30" fill="var(--maiz-200)" rx="2" />
      <rect x="80" y="200" width="20" height="20" fill="var(--maiz-200)" rx="2" />
      <rect x="115" y="200" width="20" height="20" fill="var(--maiz-200)" rx="2" />
      <rect x="30" y="200" width="6" height="130" fill="var(--masa-500)" />
      <path d="M33 195 Q15 185 5 200 Q20 198 33 205Z" fill="var(--jade-500)" />
      <path d="M33 195 Q50 185 60 200 Q45 198 33 205Z" fill="var(--jade-500)" />
      <path d="M33 200 Q15 210 5 225 Q20 215 33 212Z" fill="var(--jade-500)" />
      <path d="M33 200 Q55 210 65 225 Q45 215 33 212Z" fill="var(--jade-500)" />
      <rect x="365" y="220" width="6" height="110" fill="var(--masa-500)" />
      <path d="M368 215 Q350 205 340 220 Q355 218 368 225Z" fill="var(--jade-500)" />
      <path d="M368 215 Q385 205 395 220 Q380 218 368 225Z" fill="var(--jade-500)" />
      <rect x="0" y="330" width="400" height="70" fill="var(--masa-300)" />
      {([
        [100, 270, "var(--chili-600)"],
        [200, 280, "var(--maiz-400)"],
        [300, 275, "var(--jade-500)"],
      ] as const).map(([x, y, color], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle cx="0" cy="0" r="14" fill="var(--ink-700)" />
          <rect x="-12" y="10" width="24" height="50" rx="6" fill={color} />
        </g>
      ))}
      <line x1="20" y1="120" x2="380" y2="120" stroke="var(--ink-700)" strokeWidth="1" />
      {[60, 120, 180, 240, 300].map((x, i) => {
        const colors = [
          "var(--chili-500)",
          "var(--cielo-500)",
          "var(--rosa-500)",
          "var(--jade-500)",
          "var(--jacaranda-500)",
        ]
        return (
          <path
            key={x}
            d={`M${x - 15} 120 L${x + 15} 120 L${x + 15} 150 L${x} 165 L${x - 15} 150Z`}
            fill={colors[i]}
          />
        )
      })}
    </svg>
  )
}
