"use client"

import Link from "next/link"
import { useState } from "react"
import type { CultureCountry, CultureImage, LocalizedText } from "@chingon/shared"
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

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <Input
        type="number"
        step="1"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  )
}

const EMPTY_IMAGE: CultureImage = {
  url: "",
  sourcePage: "",
  author: "",
  license: "",
  width: 0,
  height: 0,
  alt: { en: "", de: "" },
}

/**
 * Compact editor for one Commons photo. Admins fix typos and swap a URL here —
 * they do not source photos here, so this stays a flat form with no preview.
 * Blank the URL to remove the photo (see normalize()).
 */
function ImageFields({
  label,
  value,
  onChange,
}: {
  label: string
  value: CultureImage | undefined
  onChange: (img: CultureImage) => void
}) {
  const img = value ?? EMPTY_IMAGE
  const set = (patch: Partial<CultureImage>) => onChange({ ...img, ...patch })
  return (
    <div className="rounded-[12px] border border-cielo-200 bg-cielo-50/60 p-3">
      <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-cielo-700">
        {label} — vacía la URL para quitar la foto
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="URL (upload.wikimedia.org)" value={img.url} onChange={(v) => set({ url: v })} />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Página Commons"
            value={img.sourcePage}
            onChange={(v) => set({ sourcePage: v })}
          />
        </div>
        <Field label="Autor" value={img.author} onChange={(v) => set({ author: v })} />
        <Field label="Licencia" value={img.license} onChange={(v) => set({ license: v })} />
        <NumField label="Ancho (px)" value={img.width} onChange={(v) => set({ width: v })} />
        <NumField label="Alto (px)" value={img.height} onChange={(v) => set({ height: v })} />
        <Field
          label="Alt (EN)"
          value={img.alt.en}
          onChange={(v) => set({ alt: { ...img.alt, en: v } })}
        />
        <Field
          label="Alt (DE)"
          value={img.alt.de}
          onChange={(v) => set({ alt: { ...img.alt, de: v } })}
        />
      </div>
    </div>
  )
}

function updateAt<T>(arr: T[], i: number, fn: (t: T) => T): T[] {
  return arr.map((x, j) => (j === i ? fn(x) : x))
}

function removeAt<T>(arr: T[], i: number): T[] {
  return arr.filter((_, j) => j !== i)
}

/** An image the admin blanked out is no image — otherwise zod's .url()/.min(1)
 *  rules reject the whole save with a cryptic path. */
function cleanImage(img: CultureImage | undefined): CultureImage | undefined {
  return img && img.url.trim() ? img : undefined
}

function cleanText(t: LocalizedText | undefined): LocalizedText | undefined {
  return t && (t.en.trim() || t.de.trim()) ? t : undefined
}

/** Drop empty optional fields so zod's "if present, non-empty" rules pass. */
function normalize(c: CultureCountry): CultureCountry {
  return {
    ...c,
    tagline: cleanText(c.tagline),
    heroImage: cleanImage(c.heroImage),
    slang: c.slang.map((s) => ({ ...s, example: s.example?.trim() ? s.example : undefined })),
    vocabulary: c.vocabulary.map((v) => ({
      ...v,
      note: v.note && (v.note.en.trim() || v.note.de.trim()) ? v.note : undefined,
    })),
    sights: c.sights.map((s) => ({ ...s, image: cleanImage(s.image) })),
    food: c.food?.length
      ? c.food.map((d) => ({ ...d, image: cleanImage(d.image) }))
      : undefined,
    festivals: c.festivals?.length
      ? c.festivals.map((f) => ({ ...f, image: cleanImage(f.image) }))
      : undefined,
    etiquette: c.etiquette?.length ? c.etiquette : undefined,
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

          {/* Cover — hero photo + tagline */}
          <Section title="Portada">
            <div className="grid gap-4 md:grid-cols-2">
              <Area
                label="Lema / tagline (EN)"
                value={c.tagline?.en ?? ""}
                onChange={(v) =>
                  setC({ ...c, tagline: { en: v, de: c.tagline?.de ?? "" } })
                }
              />
              <Area
                label="Lema / tagline (DE)"
                value={c.tagline?.de ?? ""}
                onChange={(v) =>
                  setC({ ...c, tagline: { en: c.tagline?.en ?? "", de: v } })
                }
              />
            </div>
            <div className="mt-4">
              <ImageFields
                label="Foto de portada"
                value={c.heroImage}
                onChange={(img) => setC({ ...c, heroImage: img })}
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
                    <div className="sm:col-span-2 lg:col-span-4">
                      <ImageFields
                        label="Foto"
                        value={s.image}
                        onChange={(img) =>
                          setC({ ...c, sights: updateAt(c.sights, i, (x) => ({ ...x, image: img })) })
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

          {/* Food */}
          <Section title="Comida">
            <div className="space-y-3">
              {(c.food ?? []).map((d, i) => (
                <RowCard
                  key={i}
                  removable
                  onRemove={() => setC({ ...c, food: removeAt(c.food ?? [], i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Plato"
                        value={d.name}
                        onChange={(v) =>
                          setC({ ...c, food: updateAt(c.food ?? [], i, (x) => ({ ...x, name: v })) })
                        }
                      />
                    </div>
                    <Area
                      label="Descripción (EN)"
                      value={d.description.en}
                      onChange={(v) =>
                        setC({
                          ...c,
                          food: updateAt(c.food ?? [], i, (x) => ({
                            ...x,
                            description: { ...x.description, en: v },
                          })),
                        })
                      }
                    />
                    <Area
                      label="Descripción (DE)"
                      value={d.description.de}
                      onChange={(v) =>
                        setC({
                          ...c,
                          food: updateAt(c.food ?? [], i, (x) => ({
                            ...x,
                            description: { ...x.description, de: v },
                          })),
                        })
                      }
                    />
                    <div className="sm:col-span-2">
                      <ImageFields
                        label="Foto"
                        value={d.image}
                        onChange={(img) =>
                          setC({ ...c, food: updateAt(c.food ?? [], i, (x) => ({ ...x, image: img })) })
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
                  food: [...(c.food ?? []), { name: "", description: { en: "", de: "" } }],
                })
              }
            >
              + Añadir plato
            </Button>
          </Section>

          {/* Festivals */}
          <Section title="Fiestas">
            <div className="space-y-3">
              {(c.festivals ?? []).map((f, i) => (
                <RowCard
                  key={i}
                  removable
                  onRemove={() => setC({ ...c, festivals: removeAt(c.festivals ?? [], i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2">
                    <Field
                      label="Fiesta"
                      value={f.name}
                      onChange={(v) =>
                        setC({
                          ...c,
                          festivals: updateAt(c.festivals ?? [], i, (x) => ({ ...x, name: v })),
                        })
                      }
                    />
                    <div />
                    <Field
                      label="Cuándo (EN)"
                      value={f.when.en}
                      onChange={(v) =>
                        setC({
                          ...c,
                          festivals: updateAt(c.festivals ?? [], i, (x) => ({
                            ...x,
                            when: { ...x.when, en: v },
                          })),
                        })
                      }
                    />
                    <Field
                      label="Cuándo (DE)"
                      value={f.when.de}
                      onChange={(v) =>
                        setC({
                          ...c,
                          festivals: updateAt(c.festivals ?? [], i, (x) => ({
                            ...x,
                            when: { ...x.when, de: v },
                          })),
                        })
                      }
                    />
                    <Area
                      label="Descripción (EN)"
                      value={f.description.en}
                      onChange={(v) =>
                        setC({
                          ...c,
                          festivals: updateAt(c.festivals ?? [], i, (x) => ({
                            ...x,
                            description: { ...x.description, en: v },
                          })),
                        })
                      }
                    />
                    <Area
                      label="Descripción (DE)"
                      value={f.description.de}
                      onChange={(v) =>
                        setC({
                          ...c,
                          festivals: updateAt(c.festivals ?? [], i, (x) => ({
                            ...x,
                            description: { ...x.description, de: v },
                          })),
                        })
                      }
                    />
                    <div className="sm:col-span-2">
                      <ImageFields
                        label="Foto"
                        value={f.image}
                        onChange={(img) =>
                          setC({
                            ...c,
                            festivals: updateAt(c.festivals ?? [], i, (x) => ({ ...x, image: img })),
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
                  festivals: [
                    ...(c.festivals ?? []),
                    { name: "", when: { en: "", de: "" }, description: { en: "", de: "" } },
                  ],
                })
              }
            >
              + Añadir fiesta
            </Button>
          </Section>

          {/* Etiquette */}
          <Section title="Buenas maneras">
            <div className="space-y-3">
              {(c.etiquette ?? []).map((e, i) => (
                <RowCard
                  key={i}
                  removable
                  onRemove={() => setC({ ...c, etiquette: removeAt(c.etiquette ?? [], i) })}
                >
                  <div className="grid gap-3 pr-8 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Título"
                        value={e.title}
                        onChange={(v) =>
                          setC({
                            ...c,
                            etiquette: updateAt(c.etiquette ?? [], i, (x) => ({ ...x, title: v })),
                          })
                        }
                      />
                    </div>
                    <Area
                      label="Texto (EN)"
                      value={e.text.en}
                      onChange={(v) =>
                        setC({
                          ...c,
                          etiquette: updateAt(c.etiquette ?? [], i, (x) => ({
                            ...x,
                            text: { ...x.text, en: v },
                          })),
                        })
                      }
                    />
                    <Area
                      label="Texto (DE)"
                      value={e.text.de}
                      onChange={(v) =>
                        setC({
                          ...c,
                          etiquette: updateAt(c.etiquette ?? [], i, (x) => ({
                            ...x,
                            text: { ...x.text, de: v },
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
                  etiquette: [
                    ...(c.etiquette ?? []),
                    { title: "", text: { en: "", de: "" } },
                  ],
                })
              }
            >
              + Añadir costumbre
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
