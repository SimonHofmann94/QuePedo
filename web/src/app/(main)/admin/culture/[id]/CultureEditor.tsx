"use client"

import Link from "next/link"
import { useState } from "react"
import type { CultureCountry } from "@chingon/shared"
import { adminSaveCultureCountry } from "@/actions/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Structured editor for one culture country. One immutable state tree,
// plain controlled inputs — validation lives in the server action (zod)
// and again in the RPC, so the client stays a dumb form.

const labelCls =
  "mb-1 block font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-ink-500"
const textareaCls =
  "min-h-24 w-full rounded-[12px] border-2 border-ink-200 bg-white px-3.5 py-2.5 font-body text-[15px] text-ink-800 placeholder:text-ink-400 outline-none transition-[border-color,box-shadow] focus-visible:border-chili-400 focus-visible:ring-4 focus-visible:ring-chili-100"

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea className={textareaCls} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] border border-ink-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[2px] text-ink-600">
        {title}
      </h2>
      {children}
    </section>
  )
}

function RowCard({
  onRemove,
  removable,
  children,
}: {
  onRemove: () => void
  removable: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative rounded-[14px] border border-ink-100 bg-masa-50 p-4">
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label="Quitar"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:bg-rosa-100 hover:text-rosa-600 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        ✕
      </button>
      {children}
    </div>
  )
}

function updateAt<T>(arr: T[], i: number, fn: (t: T) => T): T[] {
  return arr.map((x, j) => (j === i ? fn(x) : x))
}

function removeAt<T>(arr: T[], i: number): T[] {
  return arr.filter((_, j) => j !== i)
}

/** Drop empty optional fields so zod's "if present, non-empty" rules pass. */
function normalize(c: CultureCountry): CultureCountry {
  return {
    ...c,
    slang: c.slang.map((s) => ({ ...s, example: s.example?.trim() ? s.example : undefined })),
    vocabulary: c.vocabulary.map((v) => ({
      ...v,
      note: v.note && (v.note.en.trim() || v.note.de.trim()) ? v.note : undefined,
    })),
  }
}

export function CultureEditor({
  initial,
  initialSource,
  bundled,
}: {
  initial: CultureCountry
  initialSource: "db" | "bundle"
  bundled: CultureCountry | null
}) {
  const [c, setC] = useState<CultureCountry>(initial)
  const [source, setSource] = useState(initialSource)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const save = async () => {
    setSaving(true)
    setMsg(null)
    const res = await adminSaveCultureCountry(normalize(c))
    if (res.success) {
      setSource("db")
      setMsg({ ok: true, text: "¡Órale! Guardado" })
    } else {
      setMsg({ ok: false, text: res.error ?? "No se pudo guardar" })
    }
    setSaving(false)
  }

  const restore = () => {
    if (!bundled) return
    setC(bundled)
    setMsg(null)
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/culture"
            className="font-mono text-[11px] font-bold uppercase tracking-[2px] text-chili-500 hover:underline"
          >
            ← Contenido cultural
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-4xl">{c.flag}</span>
            <h1 className="font-display text-[40px] font-extrabold leading-none tracking-tight text-ink-800">
              {c.name.en}
            </h1>
            {source === "db" ? (
              <Badge color="jacaranda" variant="soft">
                Editado
              </Badge>
            ) : (
              <Badge color="ink" variant="soft">
                Original
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Basics */}
          <Section title="Datos básicos">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Bandera" value={c.flag} onChange={(v) => setC({ ...c, flag: v })} />
              <Field
                label="Nombre (EN)"
                value={c.name.en}
                onChange={(v) => setC({ ...c, name: { ...c.name, en: v } })}
              />
              <Field
                label="Nombre (DE)"
                value={c.name.de}
                onChange={(v) => setC({ ...c, name: { ...c.name, de: v } })}
              />
              <Field label="Nombre (ES)" value={c.nameEs} onChange={(v) => setC({ ...c, nameEs: v })} />
              <Field label="Capital" value={c.capital} onChange={(v) => setC({ ...c, capital: v })} />
              <Field
                label="Población"
                value={c.population}
                onChange={(v) => setC({ ...c, population: v })}
              />
            </div>
          </Section>

          {/* Texts */}
          <Section title="Textos">
            <div className="grid gap-4 md:grid-cols-2">
              <Area
                label="Intro (EN)"
                value={c.intro.en}
                onChange={(v) => setC({ ...c, intro: { ...c.intro, en: v } })}
              />
              <Area
                label="Intro (DE)"
                value={c.intro.de}
                onChange={(v) => setC({ ...c, intro: { ...c.intro, de: v } })}
              />
              <Area
                label="Dato curioso (EN)"
                value={c.funFact.en}
                onChange={(v) => setC({ ...c, funFact: { ...c.funFact, en: v } })}
              />
              <Area
                label="Dato curioso (DE)"
                value={c.funFact.de}
                onChange={(v) => setC({ ...c, funFact: { ...c.funFact, de: v } })}
              />
            </div>
          </Section>

          {/* Slang */}
          <Section title="Slang">
            <div className="space-y-3">
              {c.slang.map((s, i) => (
                <RowCard
                  key={i}
                  removable={c.slang.length > 1}
                  onRemove={() => setC({ ...c, slang: removeAt(c.slang, i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2">
                    <Field
                      label="Expresión"
                      value={s.term}
                      onChange={(v) =>
                        setC({ ...c, slang: updateAt(c.slang, i, (x) => ({ ...x, term: v })) })
                      }
                    />
                    <Field
                      label="Ejemplo (opcional)"
                      value={s.example ?? ""}
                      onChange={(v) =>
                        setC({ ...c, slang: updateAt(c.slang, i, (x) => ({ ...x, example: v })) })
                      }
                    />
                    <Field
                      label="Significado (EN)"
                      value={s.meaning.en}
                      onChange={(v) =>
                        setC({
                          ...c,
                          slang: updateAt(c.slang, i, (x) => ({
                            ...x,
                            meaning: { ...x.meaning, en: v },
                          })),
                        })
                      }
                    />
                    <Field
                      label="Significado (DE)"
                      value={s.meaning.de}
                      onChange={(v) =>
                        setC({
                          ...c,
                          slang: updateAt(c.slang, i, (x) => ({
                            ...x,
                            meaning: { ...x.meaning, de: v },
                          })),
                        })
                      }
                    />
                  </div>
                </RowCard>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                setC({ ...c, slang: [...c.slang, { term: "", meaning: { en: "", de: "" } }] })
              }
            >
              + Añadir slang
            </Button>
          </Section>

          {/* Vocabulary */}
          <Section title="Vocabulario">
            <div className="space-y-3">
              {c.vocabulary.map((v, i) => (
                <RowCard
                  key={i}
                  removable={c.vocabulary.length > 1}
                  onRemove={() => setC({ ...c, vocabulary: removeAt(c.vocabulary, i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Español"
                      value={v.es}
                      onChange={(nv) =>
                        setC({ ...c, vocabulary: updateAt(c.vocabulary, i, (x) => ({ ...x, es: nv })) })
                      }
                    />
                    <Field
                      label="Traducción (EN)"
                      value={v.translation.en}
                      onChange={(nv) =>
                        setC({
                          ...c,
                          vocabulary: updateAt(c.vocabulary, i, (x) => ({
                            ...x,
                            translation: { ...x.translation, en: nv },
                          })),
                        })
                      }
                    />
                    <Field
                      label="Traducción (DE)"
                      value={v.translation.de}
                      onChange={(nv) =>
                        setC({
                          ...c,
                          vocabulary: updateAt(c.vocabulary, i, (x) => ({
                            ...x,
                            translation: { ...x.translation, de: nv },
                          })),
                        })
                      }
                    />
                    <Field
                      label="Nota (EN, opcional)"
                      value={v.note?.en ?? ""}
                      onChange={(nv) =>
                        setC({
                          ...c,
                          vocabulary: updateAt(c.vocabulary, i, (x) => ({
                            ...x,
                            note: { en: nv, de: x.note?.de ?? "" },
                          })),
                        })
                      }
                    />
                    <Field
                      label="Nota (DE, opcional)"
                      value={v.note?.de ?? ""}
                      onChange={(nv) =>
                        setC({
                          ...c,
                          vocabulary: updateAt(c.vocabulary, i, (x) => ({
                            ...x,
                            note: { en: x.note?.en ?? "", de: nv },
                          })),
                        })
                      }
                    />
                  </div>
                </RowCard>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                setC({
                  ...c,
                  vocabulary: [...c.vocabulary, { es: "", translation: { en: "", de: "" } }],
                })
              }
            >
              + Añadir palabra
            </Button>
          </Section>

          {/* Sights */}
          <Section title="Lugares">
            <div className="space-y-3">
              {c.sights.map((s, i) => (
                <RowCard
                  key={i}
                  removable={c.sights.length > 1}
                  onRemove={() => setC({ ...c, sights: removeAt(c.sights, i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2 lg:grid-cols-4">
                    <Field
                      label="Nombre"
                      value={s.name}
                      onChange={(v) =>
                        setC({ ...c, sights: updateAt(c.sights, i, (x) => ({ ...x, name: v })) })
                      }
                    />
                    <Field
                      label="Emoji"
                      value={s.emoji}
                      onChange={(v) =>
                        setC({ ...c, sights: updateAt(c.sights, i, (x) => ({ ...x, emoji: v })) })
                      }
                    />
                    <div>
                      <label className={labelCls}>Latitud</label>
                      <Input
                        type="number"
                        step="any"
                        value={s.lat}
                        onChange={(e) =>
                          setC({
                            ...c,
                            sights: updateAt(c.sights, i, (x) => ({
                              ...x,
                              lat: e.target.value === "" ? 0 : Number(e.target.value),
                            })),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Longitud</label>
                      <Input
                        type="number"
                        step="any"
                        value={s.lng}
                        onChange={(e) =>
                          setC({
                            ...c,
                            sights: updateAt(c.sights, i, (x) => ({
                              ...x,
                              lng: e.target.value === "" ? 0 : Number(e.target.value),
                            })),
                          })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Area
                        label="Descripción (EN)"
                        value={s.description.en}
                        onChange={(v) =>
                          setC({
                            ...c,
                            sights: updateAt(c.sights, i, (x) => ({
                              ...x,
                              description: { ...x.description, en: v },
                            })),
                          })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Area
                        label="Descripción (DE)"
                        value={s.description.de}
                        onChange={(v) =>
                          setC({
                            ...c,
                            sights: updateAt(c.sights, i, (x) => ({
                              ...x,
                              description: { ...x.description, de: v },
                            })),
                          })
                        }
                      />
                    </div>
                  </div>
                </RowCard>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                setC({
                  ...c,
                  sights: [
                    ...c.sights,
                    { name: "", emoji: "", lat: 0, lng: 0, description: { en: "", de: "" } },
                  ],
                })
              }
            >
              + Añadir lugar
            </Button>
          </Section>
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-4 z-10 mt-8 flex items-center gap-3 rounded-[16px] border border-ink-100 bg-white p-4 shadow-md">
          <Button onClick={save} disabled={saving}>
            {saving ? "Cocinando…" : "Guardar"}
          </Button>
          <Button variant="ghost" onClick={restore} disabled={!bundled || saving}>
            Restaurar original
          </Button>
          {msg && (
            <span
              className={`text-sm font-bold ${msg.ok ? "text-jade-600" : "text-rosa-600"}`}
            >
              {msg.text}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
