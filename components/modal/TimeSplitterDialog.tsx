"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShuffleIcon, SaveIcon, SkipForwardIcon, ClockIcon, NotebookPenIcon, AlertTriangleIcon } from "lucide-react"
import { PracticeField } from "@/lib/attendance-constants"

interface TimeSplitterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionDurationHours: number
  practiceFields: PracticeField[]
  onSave: (splits: Record<string, number> | null, notes: string | null) => void
  isSaving: boolean
  overdueWarning?: boolean
}

export function TimeSplitterDialog({
  open,
  onOpenChange,
  sessionDurationHours,
  practiceFields,
  onSave,
  isSaving,
  overdueWarning = false,
}: TimeSplitterDialogProps) {
  const [splits, setSplits] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState("")

  const totalAllocated = useMemo(
    () =>
      Object.values(splits).reduce((sum, v) => sum + (parseFloat(v) || 0), 0),
    [splits]
  )

  const remaining = parseFloat(
    Math.max(sessionDurationHours - totalAllocated, 0).toFixed(3)
  )
  const isOver = totalAllocated > sessionDurationHours + 0.001

  function handleAutoDistribute() {
    const newSplits: Record<string, string> = {}
    practiceFields.forEach((field) => {
      newSplits[field.id] = (
        (field.percentage / 100) *
        sessionDurationHours
      ).toFixed(2)
    })
    setSplits(newSplits)
  }

  function handleSave() {
    const numericSplits: Record<string, number> = {}
    practiceFields.forEach((field) => {
      numericSplits[field.id] = parseFloat(splits[field.id] || "0") || 0
    })
    onSave(numericSplits, notes.trim() || null)
    setSplits({})
    setNotes("")
  }

  function handleSkip() {
    onSave(null, notes.trim() || null)
    setSplits({})
    setNotes("")
  }

  const allocationPct =
    sessionDurationHours > 0
      ? Math.min((totalAllocated / sessionDurationHours) * 100, 100)
      : 0

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isSaving) onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="bg-primary/10 size-12 rounded-full flex items-center justify-center mb-3">
            <ClockIcon size={22} className="text-primary" />
          </div>
          <DialogTitle className="text-xl font-black tracking-tight">
            Allocate Training Hours
          </DialogTitle>
          <DialogDescription className="text-[12px] font-medium leading-relaxed pt-1">
            Distribute your session across the PRC fields of practice. Splits are for report categorization only — they don't need to add up exactly.
          </DialogDescription>
        </DialogHeader>

        {overdueWarning && (
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
            <AlertTriangleIcon size={15} className="shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Session exceeded your goal hours</p>
              <p className="text-[11px] font-medium text-amber-600/80 dark:text-amber-400/70">
                Your session was still running when you came back. We've auto-finalized it now — review the duration and save.
              </p>
            </div>
          </div>
        )}

        {/* Session summary */}
        <div className="bg-muted/50 rounded-xl p-4 border border-primary/5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/80">
            <span>Session duration</span>
            <span className="text-primary font-black text-sm">
              {sessionDurationHours.toFixed(2)}h
            </span>
          </div>
          {practiceFields.length > 0 && (
            <>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${isOver ? "bg-amber-400" : "bg-primary"}`}
                  style={{ width: `${allocationPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground/60">
                <span>Allocated: {totalAllocated.toFixed(2)}h</span>
                <span className={isOver ? "text-amber-500 font-bold" : ""}>
                  {isOver
                    ? `Note: ${(totalAllocated - sessionDurationHours).toFixed(2)}h over session`
                    : `Remaining: ${remaining.toFixed(2)}h`}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-muted-foreground/80 flex items-center gap-1.5">
            <NotebookPenIcon size={11} /> Session notes (optional)
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you work on today?"
            rows={2}
            className="text-[12px] font-medium border-primary/10 focus-visible:ring-primary rounded-lg resize-none"
          />
        </div>

        {practiceFields.length > 0 ? (
          <>
            {/* Auto-distribute */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoDistribute}
                className="h-8 text-[11px] font-bold gap-1.5 border-primary/20 hover:bg-primary/5"
              >
                <ShuffleIcon size={12} /> Auto-distribute by %
              </Button>
            </div>

            {/* Fields */}
            <div className="space-y-2">
              {practiceFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 rounded-xl border border-primary/5 bg-muted/20 px-4 py-3"
                >
                  <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[11px] font-black text-primary">{field.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-foreground line-clamp-2 leading-snug">
                      {field.description}
                    </p>
                    <p className="text-[9px] font-semibold text-muted-foreground/50 mt-0.5">
                      {field.percentage}% max · min {field.minHours}h
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-20">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={splits[field.id] ?? ""}
                      onChange={(e) =>
                        setSplits((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      placeholder="0.00"
                      className="h-8 text-[12px] font-bold text-right border-primary/15 focus-visible:ring-primary rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground/50 w-3">h</span>
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSaving}
                className="text-[11px] font-bold gap-1.5"
              >
                <SkipForwardIcon size={12} /> Skip allocation
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-white text-[11px] font-bold gap-1.5 rounded-lg px-5"
              >
                {isSaving ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon size={12} /> Save with splits
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <Button
              onClick={handleSkip}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white text-[11px] font-bold gap-1.5 rounded-lg px-5"
            >
              {isSaving ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon size={12} /> Save session
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
