"use client"

import { differenceInSeconds, format } from "date-fns"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { AttendanceHero } from "@/components/modal/AttendanceHero"
import { AttendanceHistory } from "@/components/modal/AttendanceHistory"
import { ManualEntryDialog } from "@/components/modal/ManualEntryDialog"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"

interface AttendanceEntry {
  id: string
  clock_in: string
  clock_out: string | null
  date: string
  break_seconds: number
}

const INITIAL_ENTRIES: AttendanceEntry[] = [
  {
    id: "1",
    clock_in: "2026-03-18T08:00:00Z",
    clock_out: "2026-03-18T17:00:00Z",
    date: "2026-03-18",
    break_seconds: 3600,
  },
  {
    id: "2",
    clock_in: "2026-03-17T08:30:00Z",
    clock_out: "2026-03-17T17:30:00Z",
    date: "2026-03-17",
    break_seconds: 3600,
  },
  {
    id: "3",
    clock_in: "2026-03-16T09:00:00Z",
    clock_out: "2026-03-16T15:00:00Z",
    date: "2026-03-16",
    break_seconds: 1800,
  },
  {
    id: "4",
    clock_in: "2026-03-15T08:00:00Z",
    clock_out: "2026-03-15T12:00:00Z",
    date: "2026-03-15",
    break_seconds: 0,
  },
]

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>(INITIAL_ENTRIES)
  const [isPaused, setIsPaused] = useState(false)
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null)
  
  const { data: settings } = useGetSettings()
  const TARGET_HOURS = settings?.goalHours

  const activeEntry = useMemo(
    () => entries.find((e) => !e.clock_out),
    [entries]
  )
  const isClockedIn = !!activeEntry

  const stats = useMemo(() => {
    let totalMinutes = 0
    let todayMinutes = 0
    const todayStr = format(new Date(), "yyyy-MM-dd")

    entries.forEach((entry) => {
      if (entry.clock_out) {
        const diffSeconds =
          differenceInSeconds(
            new Date(entry.clock_out),
            new Date(entry.clock_in)
          ) - (entry.break_seconds || 0)
        const diffMinutes = diffSeconds / 60
        totalMinutes += diffMinutes
        if (entry.date === todayStr) todayMinutes += diffMinutes
      }
    })

    const totalHours = totalMinutes / 60
    return {
      totalHoursStr: totalHours.toFixed(1),
      todayHoursStr: (todayMinutes / 60).toFixed(1),
      remainingHoursStr: Math.max(TARGET_HOURS - totalHours, 0).toFixed(1),
      progress: Math.min((totalHours / TARGET_HOURS) * 100, 100),
      totalDays: new Set(entries.map((e) => e.date)).size,
    }
  }, [entries])

  function toggleClock() {
    const now = new Date()
    const nowISO = now.toISOString()
    const today = format(now, "yyyy-MM-dd")

    if (isClockedIn) {
      const updated = entries.map((e) => {
        if (!e.clock_out) {
          let finalBreaks = e.break_seconds
          if (isPaused && breakStartTime) {
            finalBreaks += differenceInSeconds(now, new Date(breakStartTime))
          }
          return { ...e, clock_out: nowISO, break_seconds: finalBreaks }
        }
        return e
      })
      setEntries(updated)
      setIsPaused(false)
      setBreakStartTime(null)
      toast.success("Session finalized and saved")
    } else {
      const newEntry: AttendanceEntry = {
        id: Math.random().toString(36).substr(2, 9),
        clock_in: nowISO,
        date: today,
        clock_out: null,
        break_seconds: 0,
      }
      setEntries([newEntry, ...entries])
      setIsPaused(false)
      toast.success("New session started")
    }
  }

  function handlePause() {
    if (!isClockedIn || isPaused) return
    setIsPaused(true)
    setBreakStartTime(new Date().toISOString())
    toast.info("Session paused (Break started)")
  }

  function handleResume() {
    if (!isClockedIn || !isPaused || !breakStartTime) return

    const breakDuration = differenceInSeconds(
      new Date(),
      new Date(breakStartTime)
    )

    const updated = entries.map((e) => {
      if (e.id === activeEntry?.id) {
        return { ...e, break_seconds: (e.break_seconds || 0) + breakDuration }
      }
      return e
    })

    setEntries(updated)
    setIsPaused(false)
    setBreakStartTime(null)
    toast.success("Session resumed")
  }

  function handleManualAdd(entry: {
    date: string
    clock_in: string
    clock_out: string
    break_minutes: number
  }) {
    const newEntry: AttendanceEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: entry.date,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_seconds: entry.break_minutes * 60,
    }
    setEntries(
      [newEntry, ...entries].sort(
        (a, b) =>
          new Date(b.clock_in).getTime() - new Date(a.clock_in).getTime()
      )
    )
    toast.success("Manual entry added")
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">
            Attendance Log
          </h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            Dummy data mode • Training performance
          </p>
        </div>

        <ManualEntryDialog onAdd={handleManualAdd} />
      </div>

      <AttendanceHero
        isClockedIn={isClockedIn}
        isPaused={isPaused}
        onToggle={toggleClock}
        onPause={handlePause}
        onResume={handleResume}
        startTime={activeEntry?.clock_in}
        totalPausedSeconds={activeEntry?.break_seconds || 0}
        totalHours={stats.totalHoursStr}
        remainingHours={stats.remainingHoursStr}
        todayHours={stats.todayHoursStr}
        totalDays={stats.totalDays}
        progress={stats.progress}
        targetHours={TARGET_HOURS}
      />

      <AttendanceHistory entries={entries} />
    </div>
  )
}
