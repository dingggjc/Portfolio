"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_PRACTICE_FIELDS, PracticeField } from "@/lib/attendance-constants"
import { ListChecksIcon, CheckCircle2Icon } from "lucide-react"

interface Session {
  clockOut: string | null
  splits?: Record<string, number> | null
}

export function FieldProgressBars({
  sessions,
  practiceFields,
}: {
  sessions: Session[]
  practiceFields?: PracticeField[]
}) {
  const fields = practiceFields?.length ? practiceFields : DEFAULT_PRACTICE_FIELDS

  const totals = useMemo(() => {
    const t: Record<string, number> = {}
    fields.forEach((f) => (t[f.id] = f.initialHours ?? 0))
    sessions.forEach((s) => {
      if (!s.splits || !s.clockOut) return
      fields.forEach((f) => { t[f.id] += s.splits?.[f.id] || 0 })
    })
    return t
  }, [sessions, fields])

  const metCount = fields.filter((f) => totals[f.id] >= f.minHours).length

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
          <ListChecksIcon size={16} className="text-primary" /> Field Requirements
        </CardTitle>
        <CardDescription className="text-[10px] font-semibold opacity-60">
          {metCount}/{fields.length} fields meeting minimum hours
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {fields.map((field) => {
          const done = totals[field.id] || 0
          const pct = field.minHours > 0 ? Math.min((done / field.minHours) * 100, 100) : 0
          const met = done >= field.minHours

          return (
            <div key={field.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex-shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[9px] font-black text-primary">{field.id}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-foreground/80 truncate">
                    {field.description.split(',')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {met && <CheckCircle2Icon size={12} className="text-primary" />}
                  <span className={`text-[11px] font-black tabular-nums ${met ? "text-primary" : "text-foreground/60"}`}>
                    {done.toFixed(1)}
                    <span className="text-[9px] font-medium text-muted-foreground/50">/{field.minHours}h</span>
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${met ? "bg-primary" : pct > 0 ? "bg-primary/50" : "bg-muted"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
        </div>
      </CardContent>
    </Card>
  )
}
