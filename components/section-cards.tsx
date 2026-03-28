"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ClockIcon, TargetIcon, HistoryIcon, PercentIcon, TrendingUpIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AttendanceSession {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
}

interface AttendanceSettings {
  goalHours?: number
  initialBalance?: number
}

interface SectionCardsProps {
  sessions?: AttendanceSession[]
  settings?: AttendanceSettings
  isLoading?: boolean
}

export function SectionCards({ sessions = [], settings, isLoading = false }: SectionCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20 mt-2" />
              <CardAction>
                <Skeleton className="h-6 w-16" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40 mt-1" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const totalHoursRendered = sessions.reduce((total, session) => {
    if (session.clockOut && session.clockIn) {
      const clockIn = new Date(session.clockIn)
      const clockOut = new Date(session.clockOut)
      const diffMs = clockOut.getTime() - clockIn.getTime()
      const breakMs = (session.break || 0) * 1000
      const workMs = diffMs - breakMs
      return total + (workMs / (1000 * 60 * 60))
    }
    return total
  }, 0)

  const today = new Date().toDateString()
  const todaySessions = sessions.filter(session => 
    new Date(session.data).toDateString() === today
  )
  const todayHours = todaySessions.reduce((total, session) => {
    if (session.clockOut && session.clockIn) {
      const clockIn = new Date(session.clockIn)
      const clockOut = new Date(session.clockOut)
      const diffMs = clockOut.getTime() - clockIn.getTime()
      const breakMs = (session.break || 0) * 1000
      const workMs = diffMs - breakMs
      return total + (workMs / (1000 * 60 * 60))
    }
    return total
  }, 0)

  const goalHours = settings?.goalHours || 600
  const initialBalance = settings?.initialBalance || 0
  const effectiveHours = totalHoursRendered + initialBalance
  const remainingHours = Math.max(0, goalHours - effectiveHours)
  const completionPercentage = goalHours > 0 ? Math.min(100, (effectiveHours / goalHours) * 100) : 0

  const hasActiveSession = sessions.some(session => session.status === "active" && !session.clockOut)
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Hours Rendered</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            {totalHoursRendered.toFixed(1)}<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <Badge variant={hasActiveSession ? "default" : "outline"} className={`text-[10px] ${hasActiveSession ? "border-primary/20 bg-primary/5 text-primary" : ""}`}>
              <ClockIcon size={12} className="mr-1" /> {hasActiveSession ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px] text-primary">
            {todayHours > 0 && (
              <>
                +{todayHours.toFixed(1)}h logged today <TrendingUpIcon className="size-3" />
              </>
            )}
            {todayHours === 0 && !hasActiveSession && (
              <>No hours logged today</>
            )}
            {hasActiveSession && todayHours === 0 && (
              <>Session in progress</>
            )}
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Total validated training hours
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">OJT Goal</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl text-primary">
            {goalHours}<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px]">
              <TargetIcon size={12} className="mr-1" /> TARGET
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px]">
            OJT Training Requirement
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Required curriculum hours
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Remaining Balance</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            {remainingHours.toFixed(1)}<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <HistoryIcon size={14} className="text-muted-foreground/50" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className={`line-clamp-1 flex gap-2 font-bold text-[11px] ${remainingHours > 0 ? "text-primary" : "text-green-600"}`}>
            {remainingHours > 0 ? "On track for completion" : "Goal completed!"}
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Hours left to finish OJT
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Completion Progress</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            {completionPercentage.toFixed(1)}<span className="ml-1 text-sm font-medium text-muted-foreground">%</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px]">
              <PercentIcon size={12} className="mr-1" /> PROGRESS
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px] text-primary">
            {completionPercentage >= 50 ? "Surpassing daily average" : "Keep up the pace"}
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            {initialBalance > 0 ? `Includes ${initialBalance}h initial balance` : 'Overall training percentage'}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
