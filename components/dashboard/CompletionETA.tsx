"use client"

import { useMemo } from "react"
import { addDays, format, differenceInCalendarDays, subDays, startOfDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FlagIcon, TrendingUpIcon, CalendarClockIcon } from "lucide-react"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
  break: number
}

interface CompletionETAProps {
  sessions: Session[]
  goalHours: number
  initialBalance: number
  targetDate?: string | null
}

export function CompletionETA({ sessions, goalHours, initialBalance, targetDate }: CompletionETAProps) {
  const { avgHoursPerActiveDay, remainingHours, etaDate, neededPerDay } = useMemo(() => {
    const completed = sessions.filter((s) => s.clockOut)

    const totalLogged = completed.reduce((sum, s) => {
      const gross = (new Date(s.clockOut!).getTime() - new Date(s.clockIn).getTime()) / 3600000
      return sum + Math.max(gross - (s.break || 0) / 3600, 0)
    }, 0)

    const effective = totalLogged + initialBalance
    const remaining = Math.max(goalHours - effective, 0)

    // avg based on last 14 days that had any activity
    const last14 = Array.from({ length: 14 }, (_, i) =>
      format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd")
    )
    const activeDayHours = last14.map((dayStr) => {
      return completed.reduce((sum, s) => {
        const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
        if (sDate !== dayStr) return sum
        const gross = (new Date(s.clockOut!).getTime() - new Date(s.clockIn).getTime()) / 3600000
        return sum + Math.max(gross - (s.break || 0) / 3600, 0)
      }, 0)
    }).filter((h) => h > 0)

    const avg = activeDayHours.length > 0
      ? activeDayHours.reduce((a, b) => a + b, 0) / activeDayHours.length
      : 0

    const daysNeeded = avg > 0 ? Math.ceil(remaining / avg) : null
    const eta = daysNeeded != null ? addDays(new Date(), daysNeeded) : null

    const neededPerDay = targetDate && remaining > 0
      ? (() => {
          const daysLeft = differenceInCalendarDays(new Date(targetDate), new Date())
          return daysLeft > 0 ? remaining / daysLeft : null
        })()
      : null

    return {
      avgHoursPerActiveDay: avg,
      remainingHours: remaining,
      etaDate: eta,
      neededPerDay,
    }
  }, [sessions, goalHours, initialBalance, targetDate])

  if (remainingHours === 0) {
    return (
      <Card className="border-primary/10 shadow-md bg-primary/5">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
            <FlagIcon size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-black tracking-tight text-primary">OJT Goal Completed!</p>
            <p className="text-[11px] font-medium text-muted-foreground">You've reached your required training hours.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Avg pace */}
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="pb-1 pt-4 px-5">
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
            <TrendingUpIcon size={11} /> Avg pace (14d)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-3xl font-black tabular-nums tracking-tighter">
            {avgHoursPerActiveDay > 0 ? avgHoursPerActiveDay.toFixed(1) : "—"}
            <span className="text-sm font-medium text-muted-foreground ml-0.5">h/day</span>
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
            On active training days only
          </p>
        </CardContent>
      </Card>

      {/* ETA at current pace */}
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="pb-1 pt-4 px-5">
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
            <CalendarClockIcon size={11} /> Finish at current pace
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-3xl font-black tracking-tighter">
            {etaDate ? format(etaDate, "MMM d") : "—"}
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
            {etaDate ? format(etaDate, "yyyy") : "Log more sessions to calculate"}
          </p>
        </CardContent>
      </Card>

      {/* Target date pace */}
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="pb-1 pt-4 px-5">
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
            <FlagIcon size={11} /> To hit target date
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-3xl font-black tabular-nums tracking-tighter">
            {neededPerDay != null ? neededPerDay.toFixed(1) : "—"}
            <span className="text-sm font-medium text-muted-foreground ml-0.5">{neededPerDay != null ? "h/day" : ""}</span>
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
            {targetDate
              ? `By ${format(new Date(targetDate), "MMM d, yyyy")}`
              : "Set a target date in Settings"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
