"use client"

import BalanceCalculator from "@/components/modal/BalanceCalculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, HistoryIcon, SaveIcon, Settings2Icon, TargetIcon } from "lucide-react"
import { useSettings } from "./settings-context"

export function OjtRequirementsCard() {
  const {
    initialHours, goalHours, targetDate, practiceFields, savingSection,
    setInitialHours, setGoalHours, setTargetDate, setPracticeFields, save,
  } = useSettings()

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
        <BalanceCalculator
          practiceFields={practiceFields}
          goalHours={Number(goalHours) || undefined}
          onApply={(v, fieldHours) => {
            setInitialHours(v.toString())
            setPracticeFields((prev) =>
              prev.map((f) => ({ ...f, initialHours: fieldHours[f.id] ?? f.initialHours ?? 0 }))
            )
          }}
        />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
              <HistoryIcon size={12} className="text-primary" />
              <Label htmlFor="initial_hours">Initial hours (Balance)</Label>
            </div>
            <Input
              id="initial_hours"
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
              <Label htmlFor="goal_hours">Goal hours (Target)</Label>
            </div>
            <Input
              id="goal_hours"
              type="number"
              value={goalHours}
              onChange={(e) => setGoalHours(e.target.value)}
              placeholder="3840"
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
              <CalendarIcon size={12} className="text-primary" />
              <Label htmlFor="target_date">Target completion date</Label>
            </div>
            <Input
              id="target_date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>
        </div>
        <div className="flex justify-end border-t border-primary/5 pt-2">
          <Button
            onClick={() => save("requirements")}
            disabled={savingSection === "requirements"}
            className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={14} />
            {savingSection === "requirements" ? "Saving..." : "Save requirements"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
