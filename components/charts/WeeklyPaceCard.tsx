"use client"

import { useMemo } from "react"
import {
  startOfWeek, endOfWeek, differenceInWeeks, eachDayOfInterval,
  format, isWithinInterval, parseISO,
} from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarRangeIcon } from "lucide-react"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
  break: number
}

interface WeeklyPaceCardProps {
  sessions: Session[]
  goalHours: number
  initialBalance: number
  targetDate?: string | null
}

function getNetHours(s: Session) {
  if (!s.clockOut) return 0
  const gross = (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / 3600000
  return Math.max(gross - (s.break || 0) / 3600, 0)
}

export function WeeklyPaceCard({ sessions, goalHours, initialBalance, targetDate }: WeeklyPaceCardProps) {
  const {
    currentWeekHours,
    requiredPerWeek,
    avgPerWeek,
    weeksLeft,
    totalLogged,
    weekDayBars,
  } = useMemo(() => {
    const today = new Date()
    const completed = sessions.filter((s) => s.clockOut)

    const totalLogged = completed.reduce((sum, s) => sum + getNetHours(s), 0) + initialBalance
    const remaining = Math.max(goalHours - totalLogged, 0)

    // Current week (Mon–Sun)
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const currentWeekHours = completed.reduce((sum, s) => {
      const d = parseISO(s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd"))
      if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
        return sum + getNetHours(s)
      }
      return sum
    }, 0)

    // Weekly average (all-time)
    const firstSession = completed.sort((a, b) => new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime())[0]
    const weeksElapsed = firstSession
      ? Math.max(differenceInWeeks(today, new Date(firstSession.clockIn)) + 1, 1)
      : 1
    const avgPerWeek = (totalLogged - initialBalance) / weeksElapsed

    // Weeks left until target
    const weeksLeft = targetDate
      ? Math.max(differenceInWeeks(new Date(targetDate), today), 1)
      : null
    const requiredPerWeek = weeksLeft != null && remaining > 0 ? remaining / weeksLeft : null

    // Per-day bars for this week (Mon–Sun)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const weekDayBars = weekDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd")
      const hrs = completed.reduce((sum, s) => {
        const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
        return sDate === dayStr ? sum + getNetHours(s) : sum
      }, 0)
      return { label: format(day, "EEE"), hrs, isToday: format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") }
    })

    return { currentWeekHours, requiredPerWeek, avgPerWeek, weeksLeft, totalLogged, weekDayBars }
  }, [sessions, goalHours, initialBalance, targetDate])

  const maxBar = Math.max(...weekDayBars.map((d) => d.hrs), requiredPerWeek ?? 0, 1)

  const status = (() => {
    if (!requiredPerWeek) return null
    if (currentWeekHours >= requiredPerWeek) return { label: "On Track", color: "text-primary", bg: "bg-primary/10 text-primary border-primary/20" }
    if (currentWeekHours >= requiredPerWeek * 0.6) return { label: "Falling Behind", color: "text-yellow-600", bg: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" }
    return { label: "Behind", color: "text-destructive", bg: "bg-destructive/10 text-destructive border-destructive/20" }
  })()

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <CalendarRangeIcon size={16} className="text-primary" /> Weekly Pace
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold opacity-60 mt-0.5">
              {weeksLeft != null ? `${weeksLeft} weeks until target` : "Set a target date for weekly goals"}
            </CardDescription>
          </div>
          {status && (
            <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-wider ${status.bg}`}>
              {status.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Day bars */}
        <div className="flex items-end gap-1.5 h-16">
          {weekDayBars.map((day) => {
            const heightPct = (day.hrs / maxBar) * 100
            return (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] font-black tabular-nums text-muted-foreground/60">
                  {day.hrs > 0 ? `${day.hrs.toFixed(1)}` : ""}
                </span>
                <div className="w-full flex flex-col justify-end" style={{ height: "36px" }}>
                  <div
                    className={`w-full rounded-sm transition-all duration-500 ${day.isToday ? "bg-primary" : "bg-primary/30"}`}
                    style={{ height: day.hrs > 0 ? `${Math.max(heightPct, 8)}%` : "2px", opacity: day.hrs > 0 ? 1 : 0.2 }}
                  />
                </div>
                <span className={`text-[8px] font-bold ${day.isToday ? "text-primary" : "text-muted-foreground/50"}`}>
                  {day.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-primary/5">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-wider">This week</p>
            <p className="text-lg font-black tabular-nums tracking-tighter text-primary">
              {currentWeekHours.toFixed(1)}<span className="text-[10px] font-medium text-muted-foreground ml-0.5">h</span>
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-wider">Needed/wk</p>
            <p className="text-lg font-black tabular-nums tracking-tighter">
              {requiredPerWeek != null ? (
                <>{requiredPerWeek.toFixed(1)}<span className="text-[10px] font-medium text-muted-foreground ml-0.5">h</span></>
              ) : "—"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-wider">Avg/wk</p>
            <p className="text-lg font-black tabular-nums tracking-tighter">
              {avgPerWeek.toFixed(1)}<span className="text-[10px] font-medium text-muted-foreground ml-0.5">h</span>
            </p>
          </div>
        </div>

        {/* Weekly progress bar */}
        {requiredPerWeek != null && (
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${currentWeekHours >= requiredPerWeek ? "bg-primary" : "bg-primary/50"}`}
                style={{ width: `${Math.min((currentWeekHours / requiredPerWeek) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[9px] font-medium text-muted-foreground/40 text-right">
              {currentWeekHours.toFixed(1)}h of {requiredPerWeek.toFixed(1)}h weekly target
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
