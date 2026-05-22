"use client"

import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { usePutSettings } from "@/app/hooks/attendance/usePutSettings"
import { ErrorDisplay } from "@/components/reusables/error-display"
import { SettingsProvider } from "./components/settings-context"
import { SettingsSkeleton } from "./components/settings-skeleton"
import { WorkScheduleCard } from "./components/work-schedule-card"

export default function SettingsPage() {
  const { data: settingsData, isLoading, isError, refetch } = useGetSettings()
  const { mutate: saveSettings } = usePutSettings()

  if (isError) {
    return (
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <ErrorDisplay title="Error loading settings" description="Failed to load settings." onRetry={refetch} />
      </div>
    )
  }

  if (isLoading) return <SettingsSkeleton />

  return (
    <SettingsProvider settingsData={settingsData} saveSettings={saveSettings} refetch={refetch}>
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            Configuration • Training System
          </p>
        </div>
        <WorkScheduleCard />
      </div>
    </SettingsProvider>
  )
}
