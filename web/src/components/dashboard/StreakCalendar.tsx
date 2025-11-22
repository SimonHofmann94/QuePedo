"use client"

import { Card } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface StreakCalendarProps {
    activityDates: string[] // Array of ISO date strings
}

export function StreakCalendar({ activityDates }: StreakCalendarProps) {
    const today = new Date()
    const days = []

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        days.push(date)
    }

    const isActiveDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        return activityDates.includes(dateStr)
    }

    const getDayLabel = (date: Date) => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return dayNames[date.getDay()]
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Weekly Streak</h2>
            <div className="grid grid-cols-7 gap-3">
                {days.map((date, index) => {
                    const active = isActiveDay(date)
                    const isToday = date.toDateString() === today.toDateString()

                    return (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <div className="text-xs text-slate-600 font-medium">
                                {getDayLabel(date)}
                            </div>
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${active
                                        ? 'bg-orange-500 shadow-lg'
                                        : 'bg-slate-100'
                                    } ${isToday ? 'ring-2 ring-orange-300' : ''}`}
                            >
                                {active ? (
                                    <Flame className="h-6 w-6 text-white animate-pulse" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                )}
                            </div>
                            <div className="text-xs text-slate-500">
                                {date.getDate()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}
