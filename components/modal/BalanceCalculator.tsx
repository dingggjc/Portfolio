"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PracticeField } from "@/lib/attendance-constants"
import { eachDayOfInterval, format, isWeekend } from "date-fns"
import { CalculatorIcon, RefreshCwIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

interface BalanceCalculatorProps {
  onApply: (hours: number, fieldHours: Record<string, number>) => void
  practiceFields?: PracticeField[]
  goalHours?: number
}

export default function BalanceCalculator({ onApply, practiceFields, goalHours }: BalanceCalculatorProps) {
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [hoursPerDay, setHoursPerDay] = useState(9)
  const [breakHoursPerDay, setBreakHoursPerDay] = useState(1)
  const [fieldHours, setFieldHours] = useState<Record<string, number>>({})

  const fields = practiceFields ?? []

  const { calculatedTotal, workDays, netPerDay } = useMemo(() => {
    try {
      const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) })
      const workDays = days.filter((d) => !isWeekend(d)).length
      const netPerDay = Math.max(hoursPerDay - breakHoursPerDay, 0)
      return { calculatedTotal: workDays * netPerDay, workDays, netPerDay }
    } catch {
      return { calculatedTotal: 0, workDays: 0, netPerDay: 0 }
    }
  }, [startDate, endDate, hoursPerDay, breakHoursPerDay])

  function autoDistribute() {
    const dist: Record<string, number> = {}
    const hasPercentages = fields.some((f) => (f.percentage ?? 0) > 0)
    if (hasPercentages) {
      fields.forEach((f) => {
        dist[f.id] = parseFloat(((f.percentage / 100) * calculatedTotal).toFixed(1))
      })
    } else {
      const equal = fields.length > 0 ? parseFloat((calculatedTotal / fields.length).toFixed(1)) : 0
      fields.forEach((f) => { dist[f.id] = equal })
    }
    setFieldHours(dist)
  }

  useEffect(() => {
    autoDistribute()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedTotal, isCalcOpen])

  const fieldTotal = Object.values(fieldHours).reduce((s, v) => s + (v || 0), 0)
  const overGoal = !!(goalHours && goalHours > 0 && calculatedTotal > goalHours)
  const goalPct = goalHours && goalHours > 0 ? Math.min((calculatedTotal / goalHours) * 100, 100) : 0

  function applyCalculated() {
    onApply(calculatedTotal, fieldHours)
    setIsCalcOpen(false)
    toast.success(`Applied ${calculatedTotal}h to initial balance`)
  }

  return (
    <Dialog open={isCalcOpen} onOpenChange={setIsCalcOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 rounded-lg border-primary/20 px-3 text-[10px] font-bold text-primary transition-all hover:bg-primary/5"
        >
          <CalculatorIcon size={14} /> Calculate balance
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black tracking-tight">
            <CalculatorIcon size={18} className="text-primary" /> Balance Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Start date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-lg border-primary/10 text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">End date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-lg border-primary/10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Shift */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Shift hours/day</Label>
              <Input
                type="number"
                min="0"
                value={hoursPerDay || ""}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                placeholder="9"
                className="h-9 rounded-lg border-primary/10 text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Break/day (h)</Label>
              <Input
                type="number"
                min="0"
                value={breakHoursPerDay || ""}
                onChange={(e) => setBreakHoursPerDay(Number(e.target.value))}
                placeholder="1"
                className="h-9 rounded-lg border-primary/10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-xl border p-4 transition-colors ${overGoal ? "border-destructive/30 bg-destructive/5" : "border-primary/10 bg-primary/5"}`}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Net earned hours</p>
                <p className={`text-4xl font-black tracking-tighter tabular-nums ${overGoal ? "text-destructive" : "text-primary"}`}>
                  {calculatedTotal.toLocaleString()}
                  <span className="ml-1 text-base font-medium text-muted-foreground">h</span>
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">
                  {netPerDay}h/day × {workDays} workdays
                  {workDays > 0 && <span className="ml-1 opacity-60">(weekends excluded)</span>}
                </p>
              </div>
              {goalHours && goalHours > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-muted-foreground/60 mb-1">of {goalHours.toLocaleString()}h goal</p>
                  <p className={`text-xl font-black tabular-nums ${overGoal ? "text-destructive" : "text-primary"}`}>
                    {goalPct.toFixed(1)}%
                  </p>
                  {overGoal && (
                    <p className="text-[9px] font-bold text-destructive mt-0.5">
                      +{(calculatedTotal - goalHours).toFixed(1)}h over
                    </p>
                  )}
                </div>
              )}
            </div>
            {goalHours && goalHours > 0 && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${overGoal ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            )}
          </div>

          {/* Field distribution */}
          {fields.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-wider">Distribute across fields</p>
                  <p className="text-[9px] font-medium text-muted-foreground/40 mt-0.5">
                    {fields.some((f) => f.percentage > 0) ? "Auto-filled from field percentages" : "Distributed equally — no percentages set"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={autoDistribute}
                  className="h-7 gap-1 text-[10px] font-bold text-primary hover:bg-primary/5 px-2"
                >
                  <RefreshCwIcon size={10} /> Reset
                </Button>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {fields.map((f) => {
                  const hrs = fieldHours[f.id] ?? 0
                  const pct = calculatedTotal > 0 ? (hrs / calculatedTotal) * 100 : 0
                  return (
                    <div key={f.id} className="flex items-center gap-3 px-3 py-2.5">
                      <span className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-primary">{f.id}</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold truncate">{f.description.split(",")[0].trim()}</p>
                        <p className="text-[9px] text-muted-foreground/50">{pct.toFixed(1)}% of total{f.percentage > 0 ? ` · ${f.percentage}% target` : ""}</p>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        value={fieldHours[f.id] ?? ""}
                        placeholder="0"
                        onChange={(e) =>
                          setFieldHours((prev) => ({ ...prev, [f.id]: parseFloat(e.target.value) || 0 }))
                        }
                        className="h-8 w-20 text-xs font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg flex-shrink-0"
                      />
                    </div>
                  )
                })}
              </div>

              <div className={`flex justify-between text-[10px] font-bold tabular-nums px-1 ${Math.abs(fieldTotal - calculatedTotal) < 0.1 ? "text-primary" : "text-muted-foreground/50"}`}>
                <span>Distributed</span>
                <span>
                  {fieldTotal.toFixed(1)}h
                  {Math.abs(fieldTotal - calculatedTotal) >= 0.1 && (
                    <span className="text-muted-foreground/40"> / {calculatedTotal}h</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={applyCalculated}
            disabled={calculatedTotal === 0}
            className="h-10 w-full gap-2 rounded-lg bg-primary font-bold text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Apply {calculatedTotal.toLocaleString()}h to initial balance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
