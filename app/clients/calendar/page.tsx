"use client"

import { useMemo, useState } from "react"
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay,
  addMonths, subMonths, differenceInSeconds,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, NotebookIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { DEFAULT_PRACTICE_FIELDS } from "@/lib/attendance-constants"
import { Skeleton } from "@/components/ui/skeleton"

interface Session {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
  notes?: string | null
  splits?: Record<string, number> | null
}

function getHoursForDay(sessions: Session[], day: Date): number {
  const dayStr = format(day, "yyyy-MM-dd")
  return sessions.reduce((sum, s) => {
    if (!s.clockOut) return sum
    const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
    if (sDate !== dayStr) return sum
    const gross = differenceInSeconds(new Date(s.clockOut), new Date(s.clockIn))
    return sum + Math.max(gross - (s.break || 0), 0) / 3600
  }, 0)
}

function getDayColor(hours: number): string {
  if (hours <= 0) return ""
  if (hours < 2) return "bg-primary/15"
  if (hours < 4) return "bg-primary/30"
  if (hours < 6) return "bg-primary/50"
  return "bg-primary/70"
}

function getDayTextColor(hours: number): string {
  if (hours >= 6) return "text-white"
  return ""
}

function hasNoteForDay(sessions: Session[], day: Date): boolean {
  const dayStr = format(day, "yyyy-MM-dd")
  return sessions.some((s) => {
    const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
    return sDate === dayStr && !!s.notes?.trim()
  })
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const { data: sessions = [], isLoading } = useGetSession()
  const { data: settings } = useGetSettings()

  const fieldMap = useMemo(() => {
    const fields = settings?.practiceFields ?? DEFAULT_PRACTICE_FIELDS
    const map: Record<string, string> = {}
    for (const f of fields) map[f.id] = f.description.split(",")[0].trim()
    return map
  }, [settings])

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const selectedSessions = useMemo(() => {
    if (!selectedDay) return []
    const dayStr = format(selectedDay, "yyyy-MM-dd")
    return sessions.filter((s: Session) => {
      const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
      return sDate === dayStr
    })
  }, [selectedDay, sessions])

  const selectedDayHours = selectedDay ? getHoursForDay(sessions, selectedDay) : 0

  const monthStats = useMemo(() => {
    const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
    const activeDays = daysInMonth.filter((d) => getHoursForDay(sessions, d) > 0).length
    const totalHours = daysInMonth.reduce((sum, d) => sum + getHoursForDay(sessions, d), 0)
    return { activeDays, totalHours }
  }, [currentMonth, sessions])

  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Calendar</h1>
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
          Training log • Monthly overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-4 border-b border-primary/5">
              {/* Month nav */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                  className="h-8 w-8"
                >
                  <ChevronLeftIcon size={16} />
                </Button>
                <div className="text-center">
                  <CardTitle className="text-lg font-black tracking-tight">
                    {format(currentMonth, "MMMM yyyy")}
                  </CardTitle>
                  <p className="text-[10px] font-semibold text-muted-foreground/60 mt-0.5">
                    {monthStats.activeDays} active days · {monthStats.totalHours.toFixed(1)}h logged
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  className="h-8 w-8"
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-4 pb-4">
              {/* Day names */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              {isLoading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const hours = getHoursForDay(sessions, day)
                    const inMonth = isSameMonth(day, currentMonth)
                    const today = isToday(day)
                    const selected = selectedDay && isSameDay(day, selectedDay)
                    const bgColor = inMonth ? getDayColor(hours) : ""
                    const textColor = inMonth ? getDayTextColor(hours) : ""
                    const hasNote = inMonth && hasNoteForDay(sessions, day)

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
                        className={[
                          "relative flex flex-col items-center justify-start rounded-lg p-1.5 pt-1 min-h-[52px] transition-all",
                          inMonth ? "hover:ring-1 hover:ring-primary/30 cursor-pointer" : "opacity-25 cursor-default",
                          bgColor,
                          textColor,
                          today ? "ring-2 ring-primary ring-offset-1" : "",
                          selected ? "ring-2 ring-primary/60" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        <span className={`text-[12px] font-bold ${today ? "text-primary" : ""} ${textColor}`}>
                          {format(day, "d")}
                        </span>
                        {hours > 0 && inMonth && (
                          <span className={`text-[9px] font-black tabular-nums mt-0.5 ${hours >= 6 ? "text-white/90" : "text-primary/70"}`}>
                            {hours.toFixed(1)}h
                          </span>
                        )}
                        {hasNote && (
                          <span className={`absolute bottom-1 right-1 size-1.5 rounded-full ${hours >= 6 ? "bg-white/70" : "bg-primary/60"}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center gap-3 mt-4 justify-end">
                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider">Hours:</span>
                {[
                  { label: "<2h", color: "bg-primary/15" },
                  { label: "2–4h", color: "bg-primary/30" },
                  { label: "4–6h", color: "bg-primary/50" },
                  { label: "6h+", color: "bg-primary/70" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className={`size-3 rounded ${l.color}`} />
                    <span className="text-[9px] font-semibold text-muted-foreground/50">{l.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day detail panel */}
        <div className="lg:col-span-1">
          <Card className="border-primary/10 shadow-md h-full">
            <CardHeader className="border-b border-primary/5 pb-3">
              <CardTitle className="text-sm font-bold tracking-tight text-muted-foreground/70">
                {selectedDay ? format(selectedDay, "EEEE, MMMM d") : "Select a day"}
              </CardTitle>
              {selectedDay && selectedDayHours > 0 && (
                <p className="text-2xl font-black tracking-tighter text-primary">
                  {selectedDayHours.toFixed(2)}h
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {!selectedDay && (
                <p className="text-[11px] font-semibold text-muted-foreground/40 text-center py-8">
                  Click a day on the calendar to see sessions
                </p>
              )}
              {selectedDay && selectedSessions.length === 0 && (
                <p className="text-[11px] font-semibold text-muted-foreground/40 text-center py-8">
                  No sessions on this day
                </p>
              )}
              {selectedSessions.map((s: Session) => {
                const gross = s.clockOut
                  ? differenceInSeconds(new Date(s.clockOut), new Date(s.clockIn))
                  : 0
                const net = Math.max(gross - (s.break || 0), 0)
                const hrs = Math.floor(net / 3600)
                const mins = Math.floor((net % 3600) / 60)

                return (
                  <div key={s.id} className="rounded-xl border border-primary/5 bg-muted/20 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <ClockIcon size={11} className="text-primary" />
                        {format(new Date(s.clockIn), "h:mm a")}
                        {s.clockOut && (
                          <span className="text-muted-foreground/50">→ {format(new Date(s.clockOut), "h:mm a")}</span>
                        )}
                      </div>
                      <Badge
                        variant={s.status === "completed" ? "secondary" : "default"}
                        className="text-[8px] font-black uppercase tracking-wider h-4 px-1.5"
                      >
                        {s.status === "completed" ? "Logged" : "Active"}
                      </Badge>
                    </div>

                    {s.clockOut && (
                      <p className="text-[12px] font-black text-foreground">
                        {hrs}h {mins}m
                        {s.break > 0 && (
                          <span className="text-[10px] font-medium text-muted-foreground/50 ml-1.5">
                            ({Math.round(s.break / 60)}m break)
                          </span>
                        )}
                      </p>
                    )}

                    {s.notes && (
                      <div className="flex items-start gap-1.5 pt-1 border-t border-primary/5">
                        <NotebookIcon size={10} className="text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-muted-foreground/70 leading-snug">
                          {s.notes}
                        </p>
                      </div>
                    )}

                    {s.splits && Object.keys(s.splits).length > 0 && (
                      <div className="pt-2 border-t border-primary/5 space-y-1.5">
                        {Object.entries(s.splits)
                          .filter(([, v]) => Number(v) > 0)
                          .map(([k, v]) => (
                            <div key={k} className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-1.5 min-w-0">
                                <span className="flex-shrink-0 mt-0.5 size-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">
                                  {k}
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground/70 leading-tight">
                                  {fieldMap[k] ?? k}
                                </span>
                              </div>
                              <span className="flex-shrink-0 text-[11px] font-black text-primary tabular-nums">
                                {Number(v).toFixed(1)}h
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
