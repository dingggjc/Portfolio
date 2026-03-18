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
import { eachDayOfInterval, format, isWeekend } from "date-fns"
import { CalculatorIcon, CalendarIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

interface BalanceCalculatorProps {
  onApply: (hours: number) => void
}

export default function BalanceCalculator({ onApply }: BalanceCalculatorProps) {
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [hoursPerDay, setHoursPerDay] = useState(9)
  const [breakHoursPerDay, setBreakHoursPerDay] = useState(1)

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

  const applyCalculated = () => {
    onApply(calculatedTotal)
    setIsCalcOpen(false)
    toast.info(`Applied ${calculatedTotal} net hours to initial balance`)
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
      <DialogContent className="sm:max-w-[420px]">
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
            <li>
              Pick your <strong>Start Date</strong> when you first began.
            </li>
            <li>
              Set <strong>End Date</strong> (defaults to today).
            </li>
            <li>
              Enter your <strong>Shift Hours</strong> (e.g., 9am-6pm is 9h).
            </li>
            <li>
              Add your <strong>Break Time</strong> (e.g., 1h lunch) to subtract
              it automatically.
            </li>
            <li>
              Weekends are automatically <strong>excluded</strong> for you!
            </li>
          </ul>
        </div>

        <div className="grid gap-4 py-4">
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

          <div className="mt-2 flex flex-col items-center justify-center gap-1 rounded-xl border border-primary/5 bg-primary/5 p-4 text-center">
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
              Your net earned hours
            </span>
            <p className="text-4xl font-black tracking-tighter text-primary">
              {calculatedTotal}
              <span className="ml-1 text-base font-medium">h</span>
            </p>
            <p className="text-[10px] font-medium text-muted-foreground/60 italic">
              (Shift - Break) × Workdays
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={applyCalculated}
            className="h-10 w-full gap-2 rounded-lg bg-primary font-bold text-white shadow-lg hover:bg-primary/90"
          >
            Apply to initial balance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
