"use client"

import { SectionCards } from "@/components/section-cards"
import { DailyHoursChart } from "@/components/charts/DailyHoursChart"
import { CumulativeProgressChart } from "@/components/charts/CumulativeProgressChart"
import { FieldDistributionChart } from "@/components/charts/FieldDistributionChart"
import { FieldProgressBars } from "@/components/charts/FieldProgressBars"
import { CompletionETA } from "@/components/dashboard/CompletionETA"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { DEFAULT_PRACTICE_FIELDS } from "@/lib/attendance-constants"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const { data: sessions = [], isLoading: sessionsLoading } = useGetSession()
  const { data: settings, isLoading: settingsLoading } = useGetSettings()

  const isLoading = sessionsLoading || settingsLoading
  const practiceFields = settings?.practiceFields ?? DEFAULT_PRACTICE_FIELDS
  const goalHours = settings?.goalHours ?? 0
  const initialBalance = settings?.initialBalance ?? 0
  const targetDate = settings?.targetDate ?? null

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 py-4 md:py-6">

        {/* Header */}
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-black tracking-tighter">Dashboard</h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70 mt-0.5">
            Training overview • OJT progress
          </p>
        </div>

        {/* Stat cards */}
        <SectionCards sessions={sessions} settings={settings} isLoading={isLoading} />

        {/* ETA & pace */}
        <div className="px-4 lg:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : (
            <CompletionETA
              sessions={sessions}
              goalHours={goalHours}
              initialBalance={initialBalance}
              targetDate={targetDate}
            />
          )}
        </div>

        {/* Charts row 1: Daily hours + Field distribution */}
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? <ChartSkeleton /> : <DailyHoursChart sessions={sessions} />}
          </div>
          <div className="lg:col-span-1">
            {isLoading ? <ChartSkeleton /> : (
              <FieldDistributionChart sessions={sessions} practiceFields={practiceFields} />
            )}
          </div>
        </div>

        {/* Charts row 2: Cumulative progress + Field progress bars */}
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? <ChartSkeleton tall /> : (
              <CumulativeProgressChart
                sessions={sessions}
                goalHours={goalHours}
                initialBalance={initialBalance}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            {isLoading ? <ChartSkeleton tall /> : (
              <FieldProgressBars sessions={sessions} practiceFields={practiceFields} />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

function ChartSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`rounded-xl border border-primary/10 shadow-md p-5 space-y-3 ${tall ? "h-[300px]" : "h-[268px]"}`}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className={`w-full rounded-lg ${tall ? "h-[220px]" : "h-[170px]"}`} />
    </div>
  )
}
