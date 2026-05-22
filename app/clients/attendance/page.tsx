"use client"

import { differenceInSeconds, format } from "date-fns"
import { useEffect, useMemo, useRef, useState } from "react"

import { useCreateSession } from "@/app/hooks/attendance/useCreateSession"
import { useDeleteSession } from "@/app/hooks/attendance/useDeleteSession"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { useUpdateSession } from "@/app/hooks/attendance/useUpdateSession"
import { AttendanceHero } from "@/components/modal/AttendanceHero"
import { AttendanceHistory } from "@/components/modal/AttendanceHistory"
import { TimeSplitterDialog } from "@/components/modal/TimeSplitterDialog"
import { PracticeField } from "@/lib/attendance-constants"
import { AttendanceHeader } from "./components/attendance-header"
import { AttendancePageSkeleton } from "./components/attendance-page-skeleton"

interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
  splits?: Record<string, number> | null
  notes?: string | null
}

export default function AttendancePage() {
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null)
  const [optimisticClockIn, setOptimisticClockIn] = useState<string | null>(null)
  const [overdueWarning, setOverdueWarning] = useState(false)
  const autoFinalizedRef = useRef(false)
  const [splitterOpen, setSplitterOpen] = useState(false)
  const [pendingSession, setPendingSession] = useState<{
    clockOut: string
    breakSeconds: number
    durationHours: number
  } | null>(null)

  const { data: settings, isLoading: settingsLoading } = useGetSettings()
  const { data: sessionData = [], isLoading: sessionsLoading } = useGetSession()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteSession()

  const isCreating = createSession.isPending
  const isUpdating = updateSession.isPending
  const TARGET_HOURS = settings?.goalHours ?? 0
  const hasGoalSet = TARGET_HOURS > 0

  const practiceFields: PracticeField[] = settings?.practiceFields ?? []

  const activeEntry = useMemo(
    () => sessionData.find((e: AttendanceEntry) => !e.clockOut),
    [sessionData]
  )
  // Once the real entry arrives, drop the optimistic placeholder
  const effectiveClockIn = activeEntry?.clockIn ?? optimisticClockIn ?? undefined
  const isClockedIn = !!activeEntry || !!optimisticClockIn
  const isPaused = activeEntry?.status === "paused"

  const stats = useMemo(() => {
    let totalMinutes = 0
    let todayMinutes = 0
    const todayStr = format(new Date(), "yyyy-MM-dd")

    sessionData.forEach((entry: AttendanceEntry) => {
      if (entry.clockOut) {
        const diffSeconds =
          differenceInSeconds(new Date(entry.clockOut), new Date(entry.clockIn)) -
          (entry.break || 0)
        const diffMinutes = diffSeconds / 60
        totalMinutes += diffMinutes
        if (entry.data === todayStr) todayMinutes += diffMinutes
      }
    })

    const totalHours = totalMinutes / 60
    const initialBalance = settings?.initialBalance || 0
    const effectiveHours = totalHours + initialBalance
    const remainingHours = hasGoalSet ? Math.max(TARGET_HOURS - effectiveHours, 0) : 0

    return {
      totalHoursStr: totalHours.toFixed(1),
      todayHoursStr: (todayMinutes / 60).toFixed(1),
      remainingHoursStr: remainingHours.toFixed(1),
      remainingSeconds: Math.round(remainingHours * 3600),
      progress: hasGoalSet ? Math.min((effectiveHours / TARGET_HOURS) * 100, 100) : 0,
      totalDays: new Set(sessionData.map((e: AttendanceEntry) => e.data)).size,
    }
  }, [sessionData, TARGET_HOURS, settings?.initialBalance, hasGoalSet])

  useEffect(() => {
    if (settingsLoading || sessionsLoading) return
    if (!activeEntry || autoFinalizedRef.current) return
    if (stats.remainingSeconds <= 0) return

    const elapsed =
      differenceInSeconds(new Date(), new Date(activeEntry.clockIn)) - (activeEntry.break || 0)

    if (elapsed >= stats.remainingSeconds) {
      autoFinalizedRef.current = true

      const clockOut = new Date().toISOString()
      const breakSeconds = activeEntry.break || 0
      const netSeconds = Math.max(
        differenceInSeconds(new Date(clockOut), new Date(activeEntry.clockIn)) - breakSeconds,
        0
      )
      setTimeout(() => {
        setOverdueWarning(true)
        setPendingSession({ clockOut, breakSeconds, durationHours: netSeconds / 3600 })
        setSplitterOpen(true)
      }, 0)
    }
  }, [settingsLoading, sessionsLoading, activeEntry, stats.remainingSeconds])

  function toggleClock() {
    if (isClockedIn) return

    if (!hasGoalSet || stats.remainingSeconds <= 0) return

    const clockIn = new Date().toISOString()
    setOptimisticClockIn(clockIn)
    createSession.mutate(
      { clockIn, status: "active" },
      { onError: () => setOptimisticClockIn(null) }
    )
  }

  function handleFinalize() {
    if (!isClockedIn || !activeEntry) return

    const clockOut = new Date().toISOString()
    const breakSeconds =
      isPaused && breakStartTime
        ? Math.floor(differenceInSeconds(new Date(), new Date(breakStartTime))) +
          (activeEntry.break || 0)
        : activeEntry.break || 0

    const grossSeconds = differenceInSeconds(new Date(clockOut), new Date(activeEntry.clockIn))
    const netSeconds = Math.max(grossSeconds - breakSeconds, 0)
    const durationHours = netSeconds / 3600

    setPendingSession({ clockOut, breakSeconds, durationHours })
    setSplitterOpen(true)
  }

  function handleSplitterSave(splits: Record<string, number> | null, notes: string | null) {
    if (!pendingSession || !activeEntry) return

    updateSession.mutate(
      {
        id: activeEntry.id,
        clockOut: pendingSession.clockOut,
        break: pendingSession.breakSeconds,
        status: "completed",
        splits,
        notes,
      },
      {
        onSuccess: () => {
          setSplitterOpen(false)
          setPendingSession(null)
          setBreakStartTime(null)
          setOptimisticClockIn(null)
        },
      }
    )
  }

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

    updateSession.mutate({ id: activeEntry.id, status: "active" })
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
    <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
      <AttendanceHeader
        sessions={sessionData}
        practiceFields={practiceFields}
        targetHours={TARGET_HOURS}
        mentorInfo={settings?.mentorInfo}
        onManualAdd={handleManualAdd}
      />

      <AttendanceHero
        isClockedIn={isClockedIn}
        isPaused={isPaused}
        onToggle={toggleClock}
        onFinalize={handleFinalize}
        onPause={handlePause}
        onResume={handleResume}
        startTime={effectiveClockIn}
        totalPausedSeconds={activeEntry?.break || 0}
        totalHours={stats.totalHoursStr}
        remainingHours={stats.remainingHoursStr}
        todayHours={stats.todayHoursStr}
        totalDays={stats.totalDays}
        progress={stats.progress}
        targetHours={TARGET_HOURS}
        remainingSeconds={stats.remainingSeconds}
        hasGoalSet={hasGoalSet}
        isSubmitting={isCreating || isUpdating}
      />

      <AttendanceHistory
        entries={sessionData}
        onDelete={handleDelete}
        isDeleting={deleteSession.isPending}
      />

      <TimeSplitterDialog
        open={splitterOpen}
        onOpenChange={(v) => { if (!isUpdating) { setSplitterOpen(v); if (!v) setOverdueWarning(false) } }}
        sessionDurationHours={pendingSession?.durationHours ?? 0}
        practiceFields={practiceFields}
        onSave={handleSplitterSave}
        isSaving={isUpdating}
        overdueWarning={overdueWarning}
      />
    </div>
  )
}
