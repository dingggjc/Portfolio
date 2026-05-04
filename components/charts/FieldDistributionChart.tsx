"use client"

import { useMemo } from "react"
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"
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
import { DEFAULT_PRACTICE_FIELDS, PracticeField } from "@/lib/attendance-constants"
import { PieChartIcon } from "lucide-react"

interface Session {
  clockOut: string | null
  splits?: Record<string, number> | null
}

const FIELD_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(220 70% 60%)",
]

export function FieldDistributionChart({
  sessions,
  practiceFields,
}: {
  sessions: Session[]
  practiceFields?: PracticeField[]
}) {
  const fields = practiceFields?.length ? practiceFields : DEFAULT_PRACTICE_FIELDS

  const { chartData, chartConfig, totalSplit } = useMemo(() => {
    const totals: Record<string, number> = {}
    fields.forEach((f) => (totals[f.id] = 0))

    sessions.forEach((s) => {
      if (!s.splits || !s.clockOut) return
      fields.forEach((f) => {
        totals[f.id] += s.splits?.[f.id] || 0
      })
    })

    const total = Object.values(totals).reduce((s, v) => s + v, 0)

    const data = fields.map((f, i) => ({
      field: f.id,
      label: `Field ${f.id}`,
      hours: parseFloat(totals[f.id].toFixed(2)),
      pct: total > 0 ? parseFloat(((totals[f.id] / total) * 100).toFixed(1)) : 0,
      fill: FIELD_COLORS[i] ?? FIELD_COLORS[0],
    }))

    const config: ChartConfig = {}
    fields.forEach((f, i) => {
      config[f.id] = {
        label: `Field ${f.id}`,
        color: FIELD_COLORS[i] ?? FIELD_COLORS[0],
      }
    })

    return { chartData: data, chartConfig: config, totalSplit: total }
  }, [sessions, fields])

  const hasSplits = totalSplit > 0

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
          <PieChartIcon size={16} className="text-primary" /> Field Distribution
        </CardTitle>
        <CardDescription className="text-[10px] font-semibold opacity-60">
          {hasSplits
            ? `${totalSplit.toFixed(1)}h split across practice fields`
            : "No time allocated to fields yet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasSplits ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-[11px] font-semibold text-muted-foreground/40 text-center px-4">
              Use the time splitter when saving sessions to track field hours
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <ChartContainer config={chartConfig} className="h-[160px] w-full">
              <RadialBarChart
                data={chartData}
                innerRadius="30%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, totalSplit]} tick={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="label"
                      formatter={(value) => `${value}h`}
                    />
                  }
                />
                <RadialBar dataKey="hours" background={{ fill: "hsl(var(--muted))" }} />
              </RadialBarChart>
            </ChartContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-2">
              {chartData.map((item) => (
                <div key={item.field} className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground/70 truncate">
                    Field {item.field}
                  </span>
                  <span className="text-[10px] font-black text-foreground ml-auto">
                    {item.hours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
