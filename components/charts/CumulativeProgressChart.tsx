"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUpIcon } from "lucide-react"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
  break: number
}

const chartConfig = {
  hours: {
    label: "Total Hours",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function CumulativeProgressChart({
  sessions,
  goalHours,
  initialBalance,
}: {
  sessions: Session[]
  goalHours: number
  initialBalance: number
}) {
  const chartData = useMemo(() => {
    const completed = sessions
      .filter((s) => s.clockOut)
      .sort(
        (a, b) =>
          new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime()
      )

    if (completed.length === 0) return []

    let running = initialBalance
    return completed.map((s) => {
      const gross =
        (new Date(s.clockOut!).getTime() - new Date(s.clockIn).getTime()) /
        3600000
      running += Math.max(gross - (s.break || 0) / 3600, 0)
      return {
        date: format(new Date(s.clockIn), "MMM d"),
        hours: parseFloat(running.toFixed(2)),
      }
    })
  }, [sessions, initialBalance])

  if (chartData.length === 0) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <TrendingUpIcon size={16} className="text-primary" /> Cumulative Progress
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold opacity-60">
            Running total vs goal
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-[11px] font-semibold text-muted-foreground/50">
            No sessions logged yet
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentHours = chartData[chartData.length - 1]?.hours ?? 0
  const pct = goalHours > 0 ? Math.min((currentHours / goalHours) * 100, 100) : 0

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
          <TrendingUpIcon size={16} className="text-primary" /> Cumulative Progress
        </CardTitle>
        <CardDescription className="text-[10px] font-semibold opacity-60">
          {currentHours.toFixed(1)}h logged · {pct.toFixed(0)}% of {goalHours}h goal
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
              unit="h"
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            {goalHours > 0 && (
              <ReferenceLine
                y={goalHours}
                stroke="hsl(var(--primary))"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: `Goal: ${goalHours}h`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "hsl(var(--primary))",
                  opacity: 0.7,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#progressGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
