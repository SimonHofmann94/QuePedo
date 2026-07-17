"use client"

import { useLayoutEffect, useRef } from "react"
import { colors } from "@chingon/shared"

export interface SightPin {
  name: string
  /** Already localized on the server. */
  description: string
  lat: number
  lng: number
  emoji: string
}

type GeodataModule = typeof import("@amcharts/amcharts5-geodata/mexicoLow")

// Dynamic importers keep per-country geodata (and amCharts itself, imported
// inside the effect) out of the main bundle — only the visited country loads.
const GEODATA: Record<string, () => Promise<GeodataModule>> = {
  mx: () => import("@amcharts/amcharts5-geodata/mexicoLow"),
  es: () => import("@amcharts/amcharts5-geodata/spainLow"),
  ar: () => import("@amcharts/amcharts5-geodata/argentinaLow"),
  co: () => import("@amcharts/amcharts5-geodata/colombiaLow"),
  pe: () => import("@amcharts/amcharts5-geodata/peruLow"),
  cl: () => import("@amcharts/amcharts5-geodata/chileLow"),
  cu: () => import("@amcharts/amcharts5-geodata/cubaLow"),
  ve: () => import("@amcharts/amcharts5-geodata/venezuelaLow"),
  ec: () => import("@amcharts/amcharts5-geodata/ecuadorLow"),
  gt: () => import("@amcharts/amcharts5-geodata/guatemalaLow"),
  bo: () => import("@amcharts/amcharts5-geodata/boliviaLow"),
  do: () => import("@amcharts/amcharts5-geodata/dominicanRepublicLow"),
  hn: () => import("@amcharts/amcharts5-geodata/hondurasLow"),
  py: () => import("@amcharts/amcharts5-geodata/paraguayLow"),
  sv: () => import("@amcharts/amcharts5-geodata/elSalvadorLow"),
  ni: () => import("@amcharts/amcharts5-geodata/nicaraguaLow"),
  cr: () => import("@amcharts/amcharts5-geodata/costaRicaLow"),
  pa: () => import("@amcharts/amcharts5-geodata/panamaLow"),
  uy: () => import("@amcharts/amcharts5-geodata/uruguayLow"),
  pr: () => import("@amcharts/amcharts5-geodata/puertoRicoLow"),
  gq: () => import("@amcharts/amcharts5-geodata/equatorialGuineaLow"),
}

export function CountrySightsMap({
  countryId,
  sights,
}: {
  countryId: string
  sights: SightPin[]
}) {
  const divRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const div = divRef.current
    const loadGeodata = GEODATA[countryId.toLowerCase()]
    if (!div || !loadGeodata) return

    let disposed = false
    let root: import("@amcharts/amcharts5").Root | undefined

    ;(async () => {
      const [am5, am5map, geodata] = await Promise.all([
        import("@amcharts/amcharts5"),
        import("@amcharts/amcharts5/map"),
        loadGeodata(),
      ])
      if (disposed) return

      root = am5.Root.new(div)

      // Static map: no pan/zoom so the page keeps scrolling normally
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          panX: "none",
          panY: "none",
          wheelY: "none",
          pinchZoom: false,
        }),
      )

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, { geoJSON: geodata.default }),
      )
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(colors.masa[200]),
        stroke: am5.color(colors.masa[400]),
        strokeWidth: 1,
      })

      const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: "lat",
          longitudeField: "lng",
        }),
      )

      pointSeries.bullets.push((bulletRoot) => {
        const container = am5.Container.new(bulletRoot, {
          centerX: am5.p50,
          centerY: am5.p50,
          cursorOverStyle: "pointer",
          tooltipText: "{description}",
        })
        // Emoji above the coordinate, name label below
        container.children.push(
          am5.Label.new(bulletRoot, {
            text: "{emoji}",
            populateText: true,
            fontSize: 24,
            centerX: am5.p50,
            centerY: am5.p100,
          }),
        )
        container.children.push(
          am5.Label.new(bulletRoot, {
            text: "{name}",
            populateText: true,
            fontSize: 11,
            fontWeight: "700",
            fill: am5.color(colors.ink[700]),
            centerX: am5.p50,
            centerY: am5.p0,
          }),
        )
        return am5.Bullet.new(bulletRoot, { sprite: container })
      })

      pointSeries.data.setAll(sights.map((s) => ({ ...s })))

      chart.appear(600, 100)
    })()

    return () => {
      disposed = true
      root?.dispose()
    }
  }, [countryId, sights])

  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />
}
