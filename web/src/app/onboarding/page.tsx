"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Plane, Wine, Briefcase, Home, GraduationCap, Gamepad2, Headphones, Eye, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    nativeLanguage: "English",
    location: "",
    proficiencyLevel: "",
    learningGoals: [] as string[],
    learningStyle: "",
    dailyStudyMinutes: 15,
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  const updateData = (key: string, value: unknown) => {
    setFormData((p) => ({ ...p, [key]: value }))
  }

  const toggleGoal = (goal: string) => {
    setFormData((p) => {
      const goals = p.learningGoals.includes(goal)
        ? p.learningGoals.filter((g) => g !== goal)
        : [...p.learningGoals, goal].slice(0, 3)
      return { ...p, learningGoals: goals }
    })
  }

  const finishOnboarding = async () => {
    if (!userId) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    const { error } = await supabase.from("user_profiles").upsert({
      id: userId,
      first_name: formData.firstName,
      native_language: formData.nativeLanguage,
      location: formData.location,
      proficiency_level: formData.proficiencyLevel,
      learning_goals: formData.learningGoals,
      learning_style: formData.learningStyle,
      daily_study_minutes: formData.dailyStudyMinutes,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    if (error) {
      console.error("Error saving profile:", error)
      alert("¡Ay, no! No se pudo guardar el perfil. Inténtalo de nuevo.")
      setIsLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-bg)] p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo size={40} />
        </div>

        <div className="rounded-[24px] border border-ink-100 bg-white p-7 shadow-md md:p-8">
          {step === 1 && (
            <Step
              title="¡Hola! Cuéntanos quién eres"
              subtitle="Lo necesitamos para personalizar tu camino."
            >
              <Field label="¿Cómo te llamamos?">
                <Input
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={(e) => updateData("firstName", e.target.value)}
                />
              </Field>
              <Field label="¿Cuál es tu idioma nativo?">
                <select
                  value={formData.nativeLanguage}
                  onChange={(e) => updateData("nativeLanguage", e.target.value)}
                  className="flex h-12 w-full rounded-[12px] border-2 border-ink-200 bg-white px-3.5 font-body text-[15px] text-ink-800 outline-none focus-visible:border-chili-400 focus-visible:ring-4 focus-visible:ring-chili-100"
                >
                  <option value="English">English</option>
                  <option value="German">Deutsch</option>
                  <option value="French">Français</option>
                  <option value="Italian">Italiano</option>
                  <option value="Portuguese">Português</option>
                </select>
              </Field>
              <Field label="¿Dónde estás?">
                <div className="grid gap-2">
                  {[
                    "Ya estoy en España / LatAm",
                    "Estoy planeando ir",
                    "Solo aprendiendo por gusto",
                  ].map((opt) => (
                    <SelectableRow
                      key={opt}
                      active={formData.location === opt}
                      onClick={() => updateData("location", opt)}
                    >
                      {opt}
                    </SelectableRow>
                  ))}
                </div>
              </Field>
              <Button
                onClick={handleNext}
                disabled={!formData.firstName || !formData.location}
                className="w-full"
              >
                Siguiente
              </Button>
            </Step>
          )}

          {step === 2 && (
            <Step title="¿Cuánto español sabes?" subtitle="No juzgamos, prometido.">
              <div className="grid gap-2.5">
                {[
                  { id: "newbie", label: "Novato", desc: "'Hola' es lo único que sé." },
                  { id: "dabbler", label: "Curioso", desc: "Pido una chela y digo gracias." },
                  { id: "conversational", label: "Conversador", desc: "Charlas básicas sobre mi día." },
                  { id: "pro", label: "Pro", desc: "Veo La Casa de Papel sin subtítulos." },
                ].map((level) => (
                  <SelectableCard
                    key={level.id}
                    active={formData.proficiencyLevel === level.id}
                    onClick={() => updateData("proficiencyLevel", level.id)}
                  >
                    <div className="font-display text-base font-bold text-ink-800">{level.label}</div>
                    <div className="mt-0.5 text-xs text-ink-500">{level.desc}</div>
                  </SelectableCard>
                ))}
              </div>
              <NavRow
                onBack={handleBack}
                onNext={handleNext}
                nextDisabled={!formData.proficiencyLevel}
              />
            </Step>
          )}

          {step === 3 && (
            <Step title="¿Por qué aprendes español?" subtitle="Elige hasta 3.">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "tourism", label: "Viajes", icon: Plane },
                  { id: "social", label: "Social & citas", icon: Wine },
                  { id: "business", label: "Trabajo", icon: Briefcase },
                  { id: "living", label: "Vivir allá", icon: Home },
                  { id: "culture", label: "Cultura", icon: GraduationCap },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-[14px] border-2 p-4 text-center transition-all",
                      formData.learningGoals.includes(goal.id)
                        ? "border-chili-500 bg-chili-50"
                        : "border-ink-200 bg-white hover:border-chili-300",
                    )}
                  >
                    <goal.icon className="h-6 w-6 text-chili-600" />
                    <span className="font-body text-sm font-semibold text-ink-700">{goal.label}</span>
                  </button>
                ))}
              </div>
              <NavRow
                onBack={handleBack}
                onNext={handleNext}
                nextDisabled={formData.learningGoals.length === 0}
              />
            </Step>
          )}

          {step === 4 && (
            <Step title="¿Cómo aprendes mejor?" subtitle="Adaptamos el contenido a ti.">
              <div className="grid gap-2.5">
                {[
                  { id: "gamer", label: "El gamer", desc: "Quizzes, rachas, retos.", icon: Gamepad2 },
                  { id: "listener", label: "El oyente", desc: "Podcasts y audio.", icon: Headphones },
                  { id: "visualizer", label: "El visual", desc: "Tarjetas y lectura.", icon: Eye },
                  { id: "speaker", label: "El hablador", desc: "Habla y pronunciación.", icon: Mic },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => updateData("learningStyle", style.id)}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-[14px] border-2 p-3.5 text-left transition-all",
                      formData.learningStyle === style.id
                        ? "border-chili-500 bg-chili-50"
                        : "border-ink-200 bg-white hover:border-chili-300",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-masa-100 text-ink-700">
                      <style.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base font-bold text-ink-800">{style.label}</div>
                      <div className="mt-0.5 text-xs text-ink-500">{style.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Field label="¿Cuánto tiempo al día?" className="mt-5">
                <div className="flex gap-2">
                  {[5, 15, 30].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => updateData("dailyStudyMinutes", min)}
                      className={cn(
                        "flex-1 rounded-[12px] border-2 py-3 text-center font-display text-base font-bold transition-all",
                        formData.dailyStudyMinutes === min
                          ? "border-chili-500 bg-chili-500 text-white shadow-[0_3px_0_var(--chili-700)]"
                          : "border-ink-200 bg-white text-ink-600",
                      )}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </Field>
              <NavRow
                onBack={handleBack}
                onNext={handleNext}
                nextDisabled={!formData.learningStyle}
              />
            </Step>
          )}

          {step === 5 && <MagicStep onMount={finishOnboarding} loading={isLoading} />}
        </div>

        {step < 5 && (
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  step >= i ? "w-6 bg-chili-500" : "w-2 bg-ink-200",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="font-display text-2xl font-extrabold tracking-tight text-ink-800 md:text-3xl">
          {title}
        </div>
        <div className="mt-1 text-sm text-ink-500">{subtitle}</div>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="font-body text-[13px] font-semibold text-ink-700">{label}</label>
      {children}
    </div>
  )
}

function SelectableRow({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[12px] border-2 px-3.5 py-3 text-left font-body text-[14px] transition-all",
        active
          ? "border-chili-500 bg-chili-50 font-semibold text-ink-800"
          : "border-ink-200 bg-white text-ink-700 hover:border-chili-300",
      )}
    >
      {children}
    </button>
  )
}

function SelectableCard({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col rounded-[14px] border-2 p-3.5 text-left transition-all",
        active ? "border-chili-500 bg-chili-50" : "border-ink-200 bg-white hover:border-chili-300",
      )}
    >
      {children}
    </button>
  )
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
}) {
  return (
    <div className="flex gap-2 pt-2">
      <Button variant="ghost" onClick={onBack} className="flex-1">Atrás</Button>
      <Button onClick={onNext} disabled={nextDisabled} className="flex-1">Siguiente</Button>
    </div>
  )
}

function MagicStep({ onMount, loading }: { onMount: () => void; loading: boolean }) {
  useEffect(() => {
    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex animate-in flex-col items-center justify-center space-y-5 py-10 fade-in duration-1000">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-chili-500/20 blur-xl" />
        <Loader2 className="relative z-10 h-16 w-16 animate-spin text-chili-500" />
      </div>
      <div className="text-center">
        <div className="font-marker text-2xl text-chili-500">Cocinando tu plan…</div>
        <div className="mt-2 space-y-1 text-sm text-ink-500">
          <div>Analizando tu nivel…</div>
          <div>Eligiendo vocabulario chingón…</div>
          <div>{loading ? "Guardando…" : "Casi listo…"}</div>
        </div>
      </div>
    </div>
  )
}
