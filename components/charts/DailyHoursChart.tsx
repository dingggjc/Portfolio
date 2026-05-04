"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subDays, startOfDay } from "date-fns"
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
import { BarChart2Icon } from "lucide-react"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
  break: number
}

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function DailyHoursChart({ sessions }: { sessions: Session[] }) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => subDays(new Date(), 13 - i))

    return days.map((day) => {
      const dayStr = format(startOfDay(day), "yyyy-MM-dd")
      const hours = sessions.reduce((sum, s) => {
        if (!s.clockOut) return sum
        const sDate = s.data?.slice(0, 10) ?? format(new Date(s.clockIn), "yyyy-MM-dd")
        if (sDate !== dayStr) return sum
        const gross =
          (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / 3600000
        return sum + Math.max(gross - (s.break || 0) / 3600, 0)
      }, 0)

      return {
        date: format(day, "MMM d"),
        hours: parseFloat(hours.toFixed(2)),
      }
    })
  }, [sessions])

  const totalDays = chartData.filter((d) => d.hours > 0).length

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
          <BarChart2Icon size={16} className="text-primary" /> Daily Hours
        </CardTitle>
        <CardDescription className="text-[10px] font-semibold opacity-60">
          Last 14 days · {totalDays} active day{totalDays !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} barSize={14}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
              interval={1}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "hsl(var(--muted-foreground))" }}
              unit="h"
              width={30}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--primary)/0.05)" }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="hours"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
