"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FlameIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
}

interface StreakBannerProps {
  sessions: Session[]
  restDays?: number[]
  isLoading?: boolean
}

const MILESTONES = [3, 7, 14, 21, 30, 60, 100, 200, 365]

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function calcStreak(sessions: Session[], restDays: number[]): number {
  const sessionDates = new Set(
    sessions
      .filter((s) => s.clockOut)
      .map((s) => (s.data ? s.data.slice(0, 10) : localDateStr(new Date(s.clockIn))))
  )

  const todayStr = localDateStr(new Date())
  let streak = 0
  const cursor = new Date()
  let skippedToday = false

  for (let i = 0; i < 366; i++) {
    const dayOfWeek = cursor.getDay()
    const dateStr = localDateStr(cursor)

    if (restDays.includes(dayOfWeek)) {
      // rest day — skip silently
    } else if (sessionDates.has(dateStr)) {
      streak++
    } else if (dateStr === todayStr && !skippedToday) {
      skippedToday = true
    } else {
      break
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function StreakBanner({ sessions, restDays = [0, 6], isLoading = false }: StreakBannerProps) {
  const streak = useMemo(() => calcStreak(sessions, restDays), [sessions, restDays])

  const nextMilestone = MILESTONES.find((m) => m > streak) ?? null
  const prevMilestone = nextMilestone ? (MILESTONES[MILESTONES.indexOf(nextMilestone) - 1] ?? 0) : MILESTONES[MILESTONES.length - 2]
  const milestoneProgress = nextMilestone
    ? ((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 100

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    )
  }

  const isActive = streak > 0

  return (
    <div className="px-4 lg:px-6">
      <Card
        className={`relative overflow-hidden shadow-md transition-all duration-300 ${
          isActive
            ? "border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-400/5 to-card"
            : "border-primary/10 bg-gradient-to-r from-muted/30 to-card"
        }`}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.04]">
          <FlameIcon size={140} className={isActive ? "text-orange-500" : "text-muted-foreground"} />
        </div>

        <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
          {/* Left — flame + number */}
          <div className="flex items-center gap-4">
            <div
              className={`flex size-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "border-orange-400/30 bg-orange-500/15 shadow-[0_0_16px_rgba(249,115,22,0.2)]"
                  : "border-muted bg-muted/30"
              }`}
            >
              <FlameIcon
                size={28}
                className={`transition-colors duration-300 ${isActive ? "text-orange-500" : "text-muted-foreground/30"}`}
              />
            </div>

            <div>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isActive ? "text-orange-500/60" : "text-muted-foreground/40"}`}>
                Day Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-4xl font-black tabular-nums leading-none tracking-tighter ${
                    isActive ? "text-orange-500" : "text-muted-foreground/30"
                  }`}
                >
                  {streak}
                </span>
                <span className="text-sm font-semibold text-muted-foreground/60">
                  consecutive {streak === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          </div>

          {/* Right — milestone + message */}
          <div className="hidden sm:flex flex-col items-end gap-2 min-w-0">
            {isActive ? (
              <>
                {nextMilestone ? (
                  <>
                    <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/40">
                      Next milestone — {nextMilestone} days
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-36 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-700"
                          style={{ width: `${milestoneProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black tabular-nums text-orange-500">
                        {streak}/{nextMilestone}
                      </span>
                    </div>
                    <p className="text-[9px] font-medium text-muted-foreground/40">
                      {nextMilestone - streak} day{nextMilestone - streak !== 1 ? "s" : ""} to go · rest days don&apos;t break it
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] font-black text-orange-500">
                    All milestones cleared. Legendary.
                  </p>
                )}
              </>
            ) : (
              <div className="text-right space-y-0.5">
                <p className="text-[11px] font-bold text-muted-foreground/50">Start your streak today</p>
                <p className="text-[9px] font-medium text-muted-foreground/30">Log a session to begin — rest days won&apos;t break it</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
