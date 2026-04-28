"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { signInWithGoogle, signUpWithEmail } from "@/actions/auth"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleGoogleSignUp() {
    await signInWithGoogle()
  }

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      setError("La contraseña necesita al menos 6 caracteres")
      return
    }
    setIsLoading(true)
    const result = await signUpWithEmail(email, password)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/onboarding")
    }
  }

  const labelCls = "font-body text-[13px] font-semibold text-ink-700"

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-bg)] p-6">
      <div className="w-full max-w-md space-y-6 rounded-[24px] border border-ink-100 bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size={56} />
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink-800">
            Empieza hoy
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Crea tu cuenta gratis y empieza tu camino al chingón
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-[14px] border-2 border-rosa-200 bg-rosa-50 p-3 text-sm font-semibold text-rosa-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>¡Ay, no! {error}</span>
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelCls}>Email</label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className={labelCls}>Contraseña</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className={labelCls}>Confirma contraseña</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? "Cocinando…" : "¡Dale, crear cuenta!"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 font-mono text-[11px] uppercase tracking-wider text-ink-400">
              o sigue con
            </span>
          </div>
        </div>

        <form action={handleGoogleSignUp}>
          <Button type="submit" variant="ghost" size="lg" className="w-full">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
        </form>

        <p className="text-center text-xs text-ink-500">
          Al registrarte, aceptas nuestros Términos y la Política de Privacidad.
          <br />
          Te damos 14 días gratis de premium 🌶
        </p>

        <div className="text-center text-sm text-ink-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-chili-600 hover:underline">
            Entrar
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="font-mono text-xs uppercase tracking-wider text-ink-400 hover:text-ink-700">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
