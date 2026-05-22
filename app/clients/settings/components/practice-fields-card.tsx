"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpenIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"
import { useSettings } from "./settings-context"

export function PracticeFieldsCard() {
  const {
    practiceFields, savingSection, totalPct,
    setPracticeFields, updateField, addField, setFieldToDelete, save,
  } = useSettings()

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-primary/5 bg-muted/5 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <BookOpenIcon size={18} className="text-primary" /> Fields of Practice
          </CardTitle>
          <CardDescription className="text-[11px] font-medium italic opacity-70">
            PRC categories for time allocation (DT Form 001).
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
            className="h-8 gap-1.5 text-[11px] font-bold border-primary/20 hover:bg-primary/5"
          >
            <PlusIcon size={12} /> Add field
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        <div className="hidden md:grid grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] gap-3 px-4 pb-1">
          <span />
          <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider">Description</span>
          <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">% (Max)</span>
          <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">Min Hrs</span>
          <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">Initial Hrs</span>
          <span />
        </div>
        {practiceFields.map((field) => (
          <div
            key={field.id}
            className="grid grid-cols-[2rem_1fr_2rem] md:grid-cols-[2rem_1fr_5rem_6rem_6rem_2rem] gap-3 items-center rounded-xl border border-primary/5 bg-muted/20 px-4 py-3"
          >
            <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-black text-primary">{field.id}</span>
            </div>
            <Input
              value={field.description}
              onChange={(e) => updateField(field.id, "description", e.target.value)}
              className="h-8 text-[12px] font-medium border-primary/10 focus-visible:ring-primary rounded-lg bg-background"
            />
            <Input
              type="number"
              min="0"
              max="100"
              value={field.percentage}
              onChange={(e) => updateField(field.id, "percentage", parseFloat(e.target.value) || 0)}
              className="hidden md:block h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background"
            />
            <Input
              type="number"
              min="0"
              value={field.minHours}
              onChange={(e) => updateField(field.id, "minHours", parseFloat(e.target.value) || 0)}
              className="hidden md:block h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background"
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              value={field.initialHours ?? 0}
              onChange={(e) => updateField(field.id, "initialHours", parseFloat(e.target.value) || 0)}
              className="hidden md:block h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background"
            />
            <button
              onClick={() => setFieldToDelete(field)}
              className="size-7 flex items-center justify-center rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2Icon size={13} />
            </button>
          </div>
        ))}
        <div
          className={`flex items-center justify-end gap-2 px-4 pt-1 text-[11px] font-bold ${
            totalPct === 100 ? "text-primary" : "text-destructive"
          }`}
        >
          <span className="text-muted-foreground/50 font-medium">Total %:</span>
          <span>{totalPct}%</span>
          {totalPct !== 100 && (
            <span className="text-[10px] font-medium text-destructive/70">(should be 100%)</span>
          )}
        </div>
        <div className="flex justify-end border-t border-primary/5 pt-2">
          <Button
            onClick={() => save("fields")}
            disabled={savingSection === "fields"}
            className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={14} />
            {savingSection === "fields" ? "Saving..." : "Save fields"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
