import Image from "next/image"

/**
 * A culture photo, flattened by the server (localized `alt`, no LocalizedText).
 * Mirrors the `CultureImage` shape in shared/content/culture/types.ts.
 */
export interface FlatImage {
  url: string
  width: number
  height: number
  author: string
  license: string
  sourcePage: string
  alt: string
}

/**
 * The attribution line. Every photo is CC-licensed from Wikimedia Commons and
 * crediting the author is a license obligation, not a nicety — so this ships
 * with the image, never as an optional prop.
 */
export function PhotoCredit({
  image,
  tone = "dark",
  className = "",
}: {
  image: FlatImage
  /** `light` sits on the page, `dark` sits on top of a photo. */
  tone?: "light" | "dark"
  className?: string
}) {
  const color = tone === "dark" ? "text-white/70 hover:text-white" : "text-ink-400 hover:text-ink-600"
  return (
    <a
      href={image.sourcePage}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-[10px] leading-tight transition-colors ${color} ${className}`}
    >
      {image.author} · {image.license}
    </a>
  )
}

/**
 * A photo in a card: fixed 3:2 crop, credit underneath.
 * `sizes` defaults to the sight/food/festival grid (3-up on lg, 2-up on sm).
 */
export function CultureFigure({
  image,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  image: FlatImage
  sizes?: string
  priority?: boolean
}) {
  return (
    <figure className="m-0">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-masa-100">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
      <figcaption className="px-5 pt-2">
        <PhotoCredit image={image} tone="light" />
      </figcaption>
    </figure>
  )
}
