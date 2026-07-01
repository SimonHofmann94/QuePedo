import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LockIcon } from "@/components/ui/icons"
import { isUserPremium } from "@/lib/premium"
import { SpeakingPicker } from "./SpeakingPicker"

export default async function SpeakingPage() {
  const premium = await isUserPremium()

  if (!premium) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/exercises"
            className="mb-6 inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-wider">Volver a ejercicios</span>
          </Link>
          <div className="rounded-[24px] border-2 border-maiz-300 bg-maiz-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maiz-400 text-white shadow-[0_4px_0_var(--maiz-600)]">
              <LockIcon size={28} />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-800">
              Práctica de habla es Premium
            </div>
            <div className="mt-2 text-sm text-ink-600">
              Habla en español, recibe corrección palabra por palabra y feedback con AI.
            </div>
            <Link
              href="/profile"
              className="mt-6 inline-flex items-center justify-center rounded-[14px] bg-chili-500 px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_0_var(--chili-700)] active:translate-y-1 active:shadow-none"
            >
              ¡Dale! Hazte Premium →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <SpeakingPicker />
}
