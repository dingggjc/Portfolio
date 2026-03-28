"use client"

import { SectionCards } from "@/components/section-cards"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon, SunIcon } from "lucide-react"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"

export default function Page() {
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useGetSession()
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useGetSettings()

  const isLoading = sessionsLoading || settingsLoading
  const hasError = sessionsError || settingsError

  if (hasError) {
    console.error('Dashboard data fetch error:', { sessionsError, settingsError })
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="mb-2 flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight @[450px]/main:text-3xl">
              Dashboard
            </h1>
            <p className="text-xs font-medium text-muted-foreground italic opacity-70">
              Welcome back! Keep tracking your progress.
            </p>
          </div>
        </div>

        <SectionCards 
          sessions={sessions || []} 
          settings={settings} 
          isLoading={isLoading}
        />

        <div className="px-4 lg:px-6">
          <Card className="overflow-hidden border-none bg-linear-to-r from-primary/10 via-background to-primary/5 shadow-md ring-1 ring-primary/20">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
                  <SunIcon className="size-6 sm:size-8 animate-pulse" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                    <MapPinIcon size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
                      Manila, Philippines
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tabular-nums">
                    32°C
                    <span className="ml-1 text-sm sm:text-lg font-medium text-muted-foreground italic block sm:inline">
                      Sunny
                    </span>
                  </h2>
                </div>
              </div>
              <div className="hidden sm:block border-l border-primary/10 pl-6 sm:pl-8">
                <p className="text-sm leading-tight font-bold text-primary">
                  High of 34°C Expected
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground italic opacity-80">
                  Currently tracking real-time training conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
