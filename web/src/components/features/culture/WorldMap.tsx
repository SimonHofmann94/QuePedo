"use client";

import { useEffect, useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useRouter } from 'next/navigation';

export function WorldMap() {
    const chartRef = useRef<am5map.MapChart | null>(null);
    const router = useRouter();

    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            projection: am5map.geoMercator(),
            minZoomLevel: 0.8,
            rotationX: -45.33,
            translateX: 1281,
            translateY: 373
        }));

        // Background
        let backgroundSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {})
        );

        backgroundSeries.mapPolygons.template.setAll({
            fill: am5.color(0x1a1a1a),
            fillOpacity: 1,
            strokeOpacity: 0
        });

        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

        // Polygon Series
        let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"]
        }));

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            toggleKey: "active",
            interactive: true,
            fill: am5.color(0xaaaaaa),
            fillOpacity: 0.2,
            cursorOverStyle: "pointer"
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0xff9966),
            fillOpacity: 0.7
        });

        polygonSeries.mapPolygons.template.states.create("active", {
            fill: am5.color(0xff9966),
            fillOpacity: 1
        });

        // Click Event
        polygonSeries.mapPolygons.template.events.on("click", function (ev) {
            const dataItem = ev.target.dataItem;
            if (dataItem) {
                const dataContext = dataItem.dataContext as any;
                if (dataContext && dataContext.id) {
                    router.push(`/culture/${dataContext.id}`);
                }
            }
        });

        // Highlighted Countries Data
        polygonSeries.data.setAll([
            { id: "VE", name: "Venezuela", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "UY", name: "Uruguay", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "SV", name: "El Salvador", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "PY", name: "Paraguay", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "PR", name: "Puerto Rico", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "PE", name: "Peru", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "PA", name: "Panama", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "NI", name: "Nicaragua", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "MX", name: "Mexico", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "HN", name: "Honduras", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "GT", name: "Guatemala", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "ES", name: "Spain", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "EC", name: "Ecuador", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "DO", name: "Dominican Republic", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "CU", name: "Cuba", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "CR", name: "Costa Rica", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "CO", name: "Colombia", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "CL", name: "Chile", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "BO", name: "Bolivia", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "BZ", name: "Belize", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } },
            { id: "AR", name: "Argentina", polygonSettings: { fill: am5.color(0xe5880f), fillOpacity: 1 } }
        ]);

        // Zoom Control
        let zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
        zoomControl.homeButton.set("visible", true);

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    }, [router]);

    return (
        <div id="chartdiv" style={{ width: "100%", height: "80vh" }}></div>
    );
}
