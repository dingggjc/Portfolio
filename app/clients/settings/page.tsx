"use client"

import BalanceCalculator from "@/components/modal/BalanceCalculator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HistoryIcon, SaveIcon, Settings2Icon, TargetIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [initialHours, setInitialHours] = useState(0)
  const [goalHours, setGoalHours] = useState(600)

  const handleSave = () => {
    toast.success("OJT requirements updated (Dummy mode)")
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
          Configuration • Training System
        </p>
      </div>

      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-primary/5 bg-muted/5 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Settings2Icon size={18} className="text-primary" /> OJT
              Requirements
            </CardTitle>
            <CardDescription className="text-[11px] font-medium italic opacity-70">
              Configure your training goals and history.
            </CardDescription>
          </div>

          <BalanceCalculator onApply={setInitialHours} />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80 lowercase first-letter:uppercase">
                <HistoryIcon size={12} className="text-primary" />
                <Label htmlFor="initial_hours">
                  Initial hours (Existing balance)
                </Label>
              </div>

              <Input
                id="initial_hours"
                type="number"
                value={initialHours}
                onChange={(e) => setInitialHours(Number(e.target.value))}
                placeholder="0"
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80 lowercase first-letter:uppercase">
                <TargetIcon size={12} className="text-primary" />
                <Label htmlFor="goal_hours">Total goal hours (Target)</Label>
              </div>
              <Input
                id="goal_hours"
                type="number"
                value={goalHours}
                onChange={(e) => setGoalHours(Number(e.target.value))}
                placeholder="600"
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button
              onClick={handleSave}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              <SaveIcon size={14} /> Save requirements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
