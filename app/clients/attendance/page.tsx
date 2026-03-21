"use client"

import { differenceInSeconds, format } from "date-fns"
import { useMemo, useState } from "react"

import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { useCreateSession } from "@/app/hooks/attendance/useCreateSession"
import { useUpdateSession } from "@/app/hooks/attendance/useUpdateSession"
import { useDeleteSession } from "@/app/hooks/attendance/useDeleteSession"
import { AttendanceHero } from "@/components/modal/AttendanceHero"
import { AttendanceHistory } from "@/components/modal/AttendanceHistory"
import { ManualEntryDialog } from "@/components/modal/ManualEntryDialog"


interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
}

export default function AttendancePage() {
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null)

  const { data: settings } = useGetSettings()
  const { data: sessionData = [] } = useGetSession()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteSession()
  const TARGET_HOURS = settings?.goalHours

  const activeEntry = useMemo(
    () => sessionData.find((e: AttendanceEntry) => !e.clockOut),
    [sessionData]
  )
  const isClockedIn = !!activeEntry
  const isPaused = activeEntry?.status === "paused"

  const stats = useMemo(() => {
    let totalMinutes = 0
    let todayMinutes = 0
    const todayStr = format(new Date(), "yyyy-MM-dd")

    sessionData.forEach((entry: AttendanceEntry) => {
      if (entry.clockOut) {
        const diffSeconds =
          differenceInSeconds(
            new Date(entry.clockOut),
            new Date(entry.clockIn)
          ) - (entry.break || 0)
        const diffMinutes = diffSeconds / 60
        totalMinutes += diffMinutes
        if (entry.data === todayStr) todayMinutes += diffMinutes
      }
    })

    const totalHours = totalMinutes / 60
    return {
      totalHoursStr: totalHours.toFixed(1),
      todayHoursStr: (todayMinutes / 60).toFixed(1),
      remainingHoursStr: Math.max(TARGET_HOURS - totalHours, 0).toFixed(1),
      progress: Math.min((totalHours / TARGET_HOURS) * 100, 100),
      totalDays: new Set(sessionData.map((e: AttendanceEntry) => e.data)).size,
    }
  }, [sessionData, TARGET_HOURS])

  function toggleClock() {
    if (isClockedIn) {
      updateSession.mutate({
        id: activeEntry.id,
        clockOut: new Date().toISOString(),
        break: isPaused && breakStartTime ? 
          Math.floor(differenceInSeconds(new Date(), new Date(breakStartTime))) + (activeEntry.break || 0) : activeEntry.break || 0,
        status: "completed"
      })
      setBreakStartTime(null)
    } else {
      createSession.mutate({
        clockIn: new Date().toISOString(),
        status: "active"
      })
    }
  }

  function handlePause() {
    if (!isClockedIn || isPaused) return
    
    const breakDuration = breakStartTime ? 
      Math.floor(differenceInSeconds(new Date(), new Date(breakStartTime))) : 0
    
    updateSession.mutate({
      id: activeEntry.id,
      break: (activeEntry.break || 0) + breakDuration,
      status: "paused"
    })
    
    setBreakStartTime(new Date().toISOString())
  }

  function handleResume() {
    if (!isClockedIn || !isPaused || !breakStartTime) return
    
    updateSession.mutate({
      id: activeEntry.id,
      status: "active"
    })
    
    setBreakStartTime(null)
  }

  function handleManualAdd(entry: {
    date: string
    clock_in: string
    clock_out: string
    break_minutes: number
  }) {
    createSession.mutate({
      clockIn: entry.clock_in,
      clockOut: entry.clock_out,
      break: entry.break_minutes * 60,
      status: "completed"
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">
            Attendance Log
          </h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            Live data mode • Training performance
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
        startTime={activeEntry?.clockIn}
        totalPausedSeconds={activeEntry?.break || 0}
        totalHours={stats.totalHoursStr}
        remainingHours={stats.remainingHoursStr}
        todayHours={stats.todayHoursStr}
        totalDays={stats.totalDays}
        progress={stats.progress}
        targetHours={TARGET_HOURS}
      />

      <AttendanceHistory entries={sessionData} onDelete={deleteSession.mutate} />
    </div>
  )
}
