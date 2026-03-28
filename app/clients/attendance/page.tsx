"use client"

import { differenceInSeconds, format } from "date-fns"
import { useMemo, useState } from "react"

import { useCreateSession } from "@/app/hooks/attendance/useCreateSession"
import { useDeleteSession } from "@/app/hooks/attendance/useDeleteSession"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { useUpdateSession } from "@/app/hooks/attendance/useUpdateSession"
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

  const { data: settings, isLoading: settingsLoading } = useGetSettings()
  const { data: sessionData = [], isLoading: sessionsLoading } = useGetSession()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteSession()
  const isCreating = createSession.isPending
  const isUpdating = updateSession.isPending
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
    const initialBalance = settings?.initialBalance || 0
    const effectiveHours = totalHours + initialBalance
    
    return {
      totalHoursStr: totalHours.toFixed(1),
      todayHoursStr: (todayMinutes / 60).toFixed(1),
      remainingHoursStr: Math.max(TARGET_HOURS - effectiveHours, 0).toFixed(1),
      progress: Math.min((effectiveHours / TARGET_HOURS) * 100, 100),
      totalDays: new Set(sessionData.map((e: AttendanceEntry) => e.data)).size,
    }
  }, [sessionData, TARGET_HOURS, settings?.initialBalance])

  function toggleClock() {
    if (isClockedIn) {
      updateSession.mutate({
        id: activeEntry.id,
        clockOut: new Date().toISOString(),
        break:
          isPaused && breakStartTime
            ? Math.floor(
                differenceInSeconds(new Date(), new Date(breakStartTime))
              ) + (activeEntry.break || 0)
            : activeEntry.break || 0,
        status: "completed",
      })
      setBreakStartTime(null)
    } else {
      createSession.mutate({
        clockIn: new Date().toISOString(),
        status: "active",
      })
    }
  }

  const isSubmitting = isCreating || isUpdating

  function handlePause() {
    if (!isClockedIn || isPaused) return

    const breakDuration = breakStartTime
      ? Math.floor(differenceInSeconds(new Date(), new Date(breakStartTime)))
      : 0

    updateSession.mutate({
      id: activeEntry.id,
      break: (activeEntry.break || 0) + breakDuration,
      status: "paused",
    })

    setBreakStartTime(new Date().toISOString())
  }

  function handleResume() {
    if (!isClockedIn || !isPaused || !breakStartTime) return

    updateSession.mutate({
      id: activeEntry.id,
      status: "active",
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
      status: "completed",
    })
  }

  function handleDelete(id: string) {
    deleteSession.mutate(id)
  }

  if (settingsLoading || sessionsLoading) {
    return <AttendancePageSkeleton />
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
        isSubmitting={isSubmitting}
      />

      <AttendanceHistory
        entries={sessionData}
        onDelete={handleDelete}
        isDeleting={deleteSession.isPending}
      />
    </div>
  )
}

function AttendancePageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-muted/50"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-muted"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border-primary/10 shadow-md lg:col-span-1">
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-muted/50"></div>
            </div>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-20 w-20 animate-pulse rounded-full bg-muted"></div>
              <div className="h-12 w-48 animate-pulse rounded bg-muted"></div>
              <div className="h-12 w-full max-w-[220px] animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-primary/10 bg-muted/20 shadow-md lg:col-span-2">
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-40 animate-pulse rounded bg-muted/50"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                  <div className="h-3 w-20 animate-pulse rounded bg-muted/50"></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-2 w-full animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-48 animate-pulse rounded bg-muted/50"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border-primary/10 shadow-md">
        <div className="space-y-4 border-b border-primary/5 bg-muted/10 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-48 animate-pulse rounded bg-muted/50"></div>
        </div>
        <div className="space-y-3 p-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-muted/20 py-3"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
