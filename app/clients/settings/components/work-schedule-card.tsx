"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDaysIcon, SaveIcon } from "lucide-react"
import { useSettings } from "./settings-context"

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
]

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function WorkScheduleCard() {
  const { restDays, savingSection, setRestDays, save } = useSettings()

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md">
      <CardHeader className="border-b border-primary/5 bg-muted/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <CalendarDaysIcon size={18} className="text-primary" /> Work Schedule
        </CardTitle>
        <CardDescription className="text-[11px] font-medium italic opacity-70">
          Mark your rest days — they won&apos;t break your attendance streak.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
            Select rest days (days off)
          </p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => {
              const isRest = restDays.includes(day.value)
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() =>
                    setRestDays((prev) =>
                      isRest ? prev.filter((d) => d !== day.value) : [...prev, day.value]
                    )
                  }
                  className={`h-10 w-14 rounded-xl text-[11px] font-black tracking-wide border transition-all duration-150 select-none ${
                    isRest
                      ? "border-primary/20 bg-muted/40 text-muted-foreground/40 line-through"
                      : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-muted-foreground/40 font-medium">
            {restDays.length === 0
              ? "No rest days — streak counts every day"
              : `Rest days: ${restDays
                  .sort()
                  .map((d) => DAY_NAMES[d])
                  .join(", ")} · Streak skips these`}
          </p>
        </div>
        <div className="flex justify-end border-t border-primary/5 pt-2">
          <Button
            onClick={() => save("schedule")}
            disabled={savingSection === "schedule"}
            className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={14} />
            {savingSection === "schedule" ? "Saving..." : "Save schedule"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
