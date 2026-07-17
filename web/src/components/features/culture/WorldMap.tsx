"use client"

import { useLayoutEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5map from "@amcharts/amcharts5/map"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import { colors } from "@chingon/shared"

export interface WorldMapCountry {
  /** Lowercase ISO-2 id. */
  id: string
  flag: string
  /** Already localized on the server. */
  name: string
}

interface WorldMapProps {
  countries: WorldMapCountry[]
  /** Fired with the lowercase ISO-2 id when a highlighted country is clicked. */
  onSelect?: (id: string) => void
}

// Note: `countries` and `onSelect` are effect dependencies — pass referentially
// stable values (server props / useState setter) or the map rebuilds per render.
export function WorldMap({ countries, onSelect }: WorldMapProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!divRef.current) return

    const root = am5.Root.new(divRef.current)
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoMercator(),
        minZoomLevel: 0.8,
        // Center the hispanosphere (Americas + Spain) on load
        rotationX: -55,
      }),
    )

    // Backdrop: every country, muted, inert. Interactivity lives entirely in
    // the culture series below — keeping this series listener-free is what
    // stops the rest of the world from hovering/clicking.
    const backdropSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      }),
    )
    backdropSeries.mapPolygons.template.setAll({
      fill: am5.color(colors.masa[200]),
      stroke: am5.color(colors.ink[100]),
      strokeWidth: 0.5,
      interactive: false,
    })

    // Culture series: only the Spanish-speaking countries, rendered on top.
    // amCharts polygon ids are UPPERCASE ISO-2.
    const cultureSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        include: countries.map((c) => c.id.toUpperCase()),
      }),
    )
    cultureSeries.mapPolygons.template.setAll({
      fill: am5.color(colors.chili[400]),
      stroke: am5.color(colors.chili[600]),
      strokeWidth: 0.5,
      interactive: true,
      cursorOverStyle: "pointer",
      tooltipText: "{flag} {name}",
    })
    cultureSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(colors.jade[400]),
    })

    // MUST come before data.setAll: setAll creates the polygon instances and
    // template events are only copied to instances at creation time —
    // listeners added afterwards silently never fire.
    cultureSeries.mapPolygons.template.events.on("click", (ev) => {
      const id = (ev.target.dataItem?.dataContext as { id?: string } | undefined)?.id
      if (id) onSelect?.(id.toLowerCase())
    })

    cultureSeries.data.setAll(
      countries.map((c) => ({ id: c.id.toUpperCase(), flag: c.flag, name: c.name })),
    )

    const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}))
    zoomControl.homeButton.set("visible", true)

    chart.appear(600, 100)

    return () => {
      root.dispose()
    }
  }, [countries, onSelect])

  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />
}
