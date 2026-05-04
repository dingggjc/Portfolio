"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_PRACTICE_FIELDS, PracticeField } from "@/lib/attendance-constants"
import { eachDayOfInterval, format, isWeekend } from "date-fns"
import { CalculatorIcon, CalendarIcon, RefreshCwIcon } from "lucide-react"
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

  const fields = practiceFields?.length ? practiceFields : DEFAULT_PRACTICE_FIELDS

  const calculatedTotal = useMemo(() => {
    try {
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      })
      const workDays = days.filter((d) => !isWeekend(d)).length
      const netHoursPerDay = Math.max(hoursPerDay - breakHoursPerDay, 0)
      return workDays * netHoursPerDay
    } catch {
      return 0
    }
  }, [startDate, endDate, hoursPerDay, breakHoursPerDay])

  function autoDistribute() {
    const dist: Record<string, number> = {}
    fields.forEach((f) => {
      dist[f.id] = parseFloat(((f.percentage / 100) * calculatedTotal).toFixed(1))
    })
    setFieldHours(dist)
  }

  useEffect(() => {
    autoDistribute()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedTotal])

  const fieldTotal = Object.values(fieldHours).reduce((s, v) => s + (v || 0), 0)

  const applyCalculated = () => {
    onApply(calculatedTotal, fieldHours)
    setIsCalcOpen(false)
    toast.info(`Applied ${calculatedTotal}h to initial balance with field breakdown`)
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
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10">
            <CalculatorIcon size={20} className="text-primary" />
          </div>
          <DialogTitle className="text-lg font-black tracking-tight">
            Auto balance calculator
          </DialogTitle>
          <DialogDescription className="pt-1 text-[11px] leading-relaxed font-medium">
            Automatically calculate your finished hours from a previous system
            or manual logs.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
          <p className="mb-1 text-[10px] font-bold tracking-wider text-primary uppercase">
            How to use:
          </p>
          <ul className="list-disc space-y-1 pl-3 text-[10px] font-medium text-muted-foreground">
            <li>Pick your <strong>Start Date</strong> when you first began.</li>
            <li>Set <strong>End Date</strong> (defaults to today).</li>
            <li>Enter your <strong>Shift Hours</strong> (e.g., 9am-6pm is 9h).</li>
            <li>Add your <strong>Break Time</strong> (e.g., 1h lunch) to subtract it automatically.</li>
            <li>Weekends are automatically <strong>excluded</strong> for you!</li>
          </ul>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Start date
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 rounded-lg border-primary/10 pl-9 text-xs font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                End date
              </Label>
              <div className="relative">
                <CalendarIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 rounded-lg border-primary/10 pl-9 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Shift hours/day
              </Label>
              <Input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="h-10 rounded-lg border-primary/10 text-xs font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Daily break (h)
              </Label>
              <Input
                type="number"
                value={breakHoursPerDay}
                onChange={(e) => setBreakHoursPerDay(Number(e.target.value))}
                className="h-10 rounded-lg border-primary/10 text-xs font-medium text-red-500"
              />
            </div>
          </div>

          <div className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-4 text-center transition-colors ${goalHours && calculatedTotal > goalHours ? "border-destructive/30 bg-destructive/5" : "border-primary/5 bg-primary/5"}`}>
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              Your net earned hours
            </span>
            <p className={`text-4xl font-black tracking-tighter ${goalHours && calculatedTotal > goalHours ? "text-destructive" : "text-primary"}`}>
              {calculatedTotal}
              <span className="ml-1 text-base font-medium">h</span>
            </p>
            <p className="text-[10px] font-medium text-muted-foreground/60 italic">
              (Shift - Break) × Workdays
            </p>
            {goalHours && calculatedTotal > goalHours && (
              <p className="mt-1 text-[10px] font-bold text-destructive">
                Exceeds your goal of {goalHours}h by {(calculatedTotal - goalHours).toFixed(1)}h — consider adjusting your dates or shift.
              </p>
            )}
          </div>

          {/* Per-field distribution */}
          <div className="space-y-2 border-t border-primary/5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-wider">
                  Distribute across fields
                </p>
                <p className="text-[9px] font-medium text-muted-foreground/40 mt-0.5">
                  Auto-filled from percentages — edit freely
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={autoDistribute}
                className="h-7 gap-1 text-[10px] font-bold text-primary hover:bg-primary/5 px-2"
              >
                <RefreshCwIcon size={10} /> Auto
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-lg border border-primary/5 bg-muted/20 px-3 py-2">
                  <span className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-black text-primary">{f.id}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-foreground/70 truncate leading-tight">
                      {f.description.split(",")[0].trim()}
                    </p>
                    <p className="text-[9px] text-muted-foreground/40">{f.percentage}% of total</p>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={fieldHours[f.id] ?? 0}
                    onChange={(e) =>
                      setFieldHours((prev) => ({ ...prev, [f.id]: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-8 w-20 text-xs font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg flex-shrink-0"
                  />
                </div>
              ))}
            </div>
            <div className={`text-right text-[10px] font-bold tabular-nums ${Math.abs(fieldTotal - calculatedTotal) < 0.1 ? "text-primary" : "text-muted-foreground/50"}`}>
              Total distributed: {fieldTotal.toFixed(1)}h
              {Math.abs(fieldTotal - calculatedTotal) >= 0.1 && (
                <span className="ml-1 text-muted-foreground/40">/ {calculatedTotal}h</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={applyCalculated}
            disabled={!!(goalHours && calculatedTotal > goalHours)}
            className="h-10 w-full gap-2 rounded-lg bg-primary font-bold text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Apply to initial balance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
