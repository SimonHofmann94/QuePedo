"use client"

import dynamic from 'next/dynamic'

// Dynamically import WorldMap with no SSR because amCharts requires window object
const WorldMap = dynamic(
    () => import('@/components/features/culture/WorldMap').then(mod => mod.WorldMap),
    { ssr: false }
)

export default function CulturePage() {
    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6">Culture Map</h1>
            <div className="flex-1 rounded-xl overflow-hidden border border-[#333] shadow-lg bg-[#151515]">
                <WorldMap />
            </div>
        </div>
    )
}
