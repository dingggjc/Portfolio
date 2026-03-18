"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { PlusIcon, InfoIcon, HelpCircleIcon } from "lucide-react"
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

interface ManualEntryDialogProps {
  onAdd: (entry: { date: string, clock_in: string, clock_out: string, break_minutes: number }) => void
}

export function ManualEntryDialog({ onAdd }: ManualEntryDialogProps) {
  const [manualDate, setManualDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [manualIn, setManualIn] = useState("08:00")
  const [manualOut, setManualOut] = useState("17:00")
  const [breakMinutes, setBreakMinutes] = useState(60)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clockInDate = new Date(`${manualDate}T${manualIn}:00`)
    const clockOutDate = new Date(`${manualDate}T${manualOut}:00`)

    onAdd({
      date: manualDate,
      clock_in: clockInDate.toISOString(),
      clock_out: clockOutDate.toISOString(),
      break_minutes: Number(breakMinutes)
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-semibold">
          <PlusIcon size={14} /> Add manual entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">Add manual entry</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Log a previous training session manually.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3 mb-2 border border-primary/5">
              <div className="flex gap-3">
                <InfoIcon size={14} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-foreground">Manual entry guide</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                    Use this to log training hours you missed or sessions where you forgot to clock in/out.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <HelpCircleIcon size={14} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-foreground">Total hours</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                    Manual sessions are calculated as straight time. Make sure your In and Out times are accurate.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold text-muted-foreground">Date</Label>
              <Input id="date" type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} required className="rounded-lg border-primary/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clock_in" className="text-xs font-bold text-muted-foreground">Clock in</Label>
                <Input id="clock_in" type="time" value={manualIn} onChange={(e) => setManualIn(e.target.value)} required className="rounded-lg border-primary/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clock_out" className="text-xs font-bold text-muted-foreground">Clock out</Label>
                <Input id="clock_out" type="time" value={manualOut} onChange={(e) => setManualOut(e.target.value)} required className="rounded-lg border-primary/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="break_min" className="text-xs font-bold text-muted-foreground">Break duration (minutes)</Label>
              <Input id="break_min" type="number" min="0" value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} required className="rounded-lg border-primary/10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full font-bold">Save session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
