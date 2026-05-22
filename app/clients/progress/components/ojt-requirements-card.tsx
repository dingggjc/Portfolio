"use client"

import { useEffect, useState } from "react"
import { addDays, format, isWeekend } from "date-fns"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { usePutSettings } from "@/app/hooks/attendance/usePutSettings"
import BalanceCalculator from "@/components/modal/BalanceCalculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, HistoryIcon, SaveIcon, Settings2Icon, TargetIcon, WandSparklesIcon } from "lucide-react"
import { toast } from "sonner"
import { PracticeField } from "@/lib/attendance-constants"

interface Props {
  totalRendered?: number
}

function projectCompletionDate(remainingHours: number, shiftHours: number, breakHours: number): string | null {
  const netPerDay = Math.max(shiftHours - breakHours, 0)
  if (netPerDay === 0 || remainingHours <= 0) return null
  const workDaysNeeded = Math.ceil(remainingHours / netPerDay)
  let date = new Date()
  let counted = 0
  while (counted < workDaysNeeded) {
    date = addDays(date, 1)
    if (!isWeekend(date)) counted++
  }
  return format(date, "yyyy-MM-dd")
}

export function OjtRequirementsCard({ totalRendered = 0 }: Props) {
  const { data: settings, refetch } = useGetSettings()
  const { mutate: saveSettings } = usePutSettings()

  const [initialHours, setInitialHours] = useState("")
  const [goalHours, setGoalHours] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Projection popover state
  const [projOpen, setProjOpen] = useState(false)
  const [projShift, setProjShift] = useState(9)
  const [projBreak, setProjBreak] = useState(1)

  useEffect(() => {
    if (settings && !hydrated) {
      setInitialHours(settings.initialBalance?.toString() || "")
      setGoalHours(settings.goalHours?.toString() || "")
      setTargetDate(settings.targetDate?.slice(0, 10) || "")
      setHydrated(true)
    }
  }, [settings, hydrated])

  const practiceFields = (settings?.practiceFields ?? []) as PracticeField[]
  const goal = Number(goalHours) || 0
  const remaining = Math.max(goal - totalRendered, 0)

  const projectedDate = projOpen
    ? projectCompletionDate(remaining, projShift, projBreak)
    : null

  function applyProjectedDate() {
    if (!projectedDate) return
    setTargetDate(projectedDate)
    setProjOpen(false)
    toast.success("Target date applied")
  }

  function handleSave() {
    setSaving(true)
    const toastId = toast.loading("Saving requirements...")
    saveSettings(
      {
        goalHours: Number(goalHours) || 0,
        initialBalance: Number(initialHours) || 0,
        practiceFields: settings?.practiceFields,
        mentorInfo: settings?.mentorInfo,
        targetDate: targetDate || null,
        restDays: settings?.restDays,
      },
      {
        onSuccess: () => {
          refetch()
          setSaving(false)
          toast.success("Requirements saved", { id: toastId })
        },
        onError: () => {
          setSaving(false)
          toast.error("Failed to save requirements", { id: toastId })
        },
      }
    )
  }

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-primary/5 bg-muted/5 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Settings2Icon size={18} className="text-primary" /> OJT Requirements
          </CardTitle>
          <CardDescription className="text-[11px] font-medium italic opacity-70">
            Configure your training goals and history.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <BalanceCalculator
            practiceFields={practiceFields}
            goalHours={goal || undefined}
            onApply={(v, fieldHours) => {
              setInitialHours(v.toString())
              saveSettings(
                {
                  goalHours: goal,
                  initialBalance: v,
                  practiceFields: practiceFields.map((f) => ({
                    ...f,
                    initialHours: fieldHours[f.id] ?? f.initialHours ?? 0,
                  })),
                  mentorInfo: settings?.mentorInfo,
                  targetDate: targetDate || null,
                  restDays: settings?.restDays,
                },
                { onSuccess: () => refetch() }
              )
            }}
          />
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold"
          >
            <SaveIcon size={13} />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
              <HistoryIcon size={12} className="text-primary" />
              <Label htmlFor="prog_initial_hours">Initial hours (Balance)</Label>
            </div>
            <Input
              id="prog_initial_hours"
              type="number"
              value={initialHours}
              onChange={(e) => setInitialHours(e.target.value)}
              placeholder="0"
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
              <TargetIcon size={12} className="text-primary" />
              <Label htmlFor="prog_goal_hours">Goal hours (Target)</Label>
            </div>
            <Input
              id="prog_goal_hours"
              type="number"
              value={goalHours}
              onChange={(e) => setGoalHours(e.target.value)}
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                <CalendarIcon size={12} className="text-primary" />
                <Label htmlFor="prog_target_date">Target completion date</Label>
              </div>
              <Popover open={projOpen} onOpenChange={setProjOpen}>
                <PopoverTrigger asChild>
                  <button
                    disabled={goal === 0}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <WandSparklesIcon size={10} /> Calculate
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 space-y-4" align="end">
                  <div>
                    <p className="text-[11px] font-black tracking-wide">Project completion date</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      Based on {remaining.toFixed(1)}h remaining at your daily pace
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shift (h/day)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={projShift || ""}
                        placeholder="9"
                        onChange={(e) => setProjShift(Number(e.target.value))}
                        className="h-8 text-xs font-medium border-primary/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Break (h/day)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={projBreak || ""}
                        placeholder="1"
                        onChange={(e) => setProjBreak(Number(e.target.value))}
                        className="h-8 text-xs font-medium border-primary/10"
                      />
                    </div>
                  </div>

                  {projectedDate ? (
                    <div className="rounded-lg border border-primary/10 bg-primary/5 px-3 py-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground/60 font-medium">Estimated completion</p>
                      <p className="text-base font-black tracking-tight text-primary mt-0.5">
                        {format(new Date(projectedDate), "MMMM d, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        {Math.max(projShift - projBreak, 0)}h/day · weekends excluded
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border px-3 py-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground/50">
                        {remaining <= 0 ? "Goal already reached!" : "Enter a valid shift and break"}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={applyProjectedDate}
                    disabled={!projectedDate}
                    className="h-8 w-full text-[11px] font-bold gap-1.5 disabled:opacity-40"
                  >
                    <CalendarIcon size={12} /> Apply as target date
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              id="prog_target_date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
