"use client"

import { useMemo, useState } from "react"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { usePutSettings } from "@/app/hooks/attendance/usePutSettings"
import { PracticeField } from "@/lib/attendance-constants"
import { ErrorDisplay } from "@/components/reusables/error-display"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PencilIcon, PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { FieldProgressCard } from "./components/field-progress-card"
import { OjtRequirementsCard } from "./components/ojt-requirements-card"
import { ProgressSkeleton } from "./components/progress-skeleton"

interface Session {
  clockOut: string | null
  clockIn: string
  break: number
  splits?: Record<string, number> | null
}

type Mode = "view" | "edit" | "add"

function nextLetterId(fields: PracticeField[]) {
  const letters = fields.map((f) => f.id).filter((id) => /^[A-Z]$/.test(id)).sort()
  const last = letters.at(-1)
  return last && last < "Z" ? String.fromCharCode(last.charCodeAt(0) + 1) : String.fromCharCode(65 + fields.length)
}

function reletter(fields: PracticeField[]) {
  return fields.map((f, i) => ({ ...f, id: String.fromCharCode(65 + i) }))
}

export default function ProgressPage() {
  const { data: sessions = [], isLoading: sessionsLoading, isError: sessionsError } = useGetSession()
  const { data: settings, isLoading: settingsLoading, isError: settingsError, refetch } = useGetSettings()
  const { mutate: saveSettings } = usePutSettings()

  const [mode, setMode] = useState<Mode>("view")
  const [localFields, setLocalFields] = useState<PracticeField[]>([])
  const [fieldToDelete, setFieldToDelete] = useState<PracticeField | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [optimisticFields, setOptimisticFields] = useState<PracticeField[] | null>(null)

  const isLoading = sessionsLoading || settingsLoading
  const isError = sessionsError || settingsError

  const savedFields = (settings?.practiceFields ?? []) as PracticeField[]
  const displayFields = mode === "view" ? (optimisticFields ?? savedFields) : localFields
  const goalHours = settings?.goalHours ?? 3840
  const initialBalance = settings?.initialBalance ?? 0

  const { fieldTotals, totalRendered } = useMemo(() => {
    const completed = (sessions as Session[]).filter((s) => s.clockOut)
    const totals: Record<string, number> = {}
    savedFields.forEach((f) => { totals[f.id] = f.initialHours ?? 0 })
    completed.forEach((s) => {
      if (!s.splits) return
      savedFields.forEach((f) => { totals[f.id] += s.splits?.[f.id] || 0 })
    })
    const totalRendered = Object.values(totals).reduce((a, b) => a + b, 0) + initialBalance
    return { fieldTotals: totals, totalRendered }
  }, [sessions, savedFields, initialBalance])

  function startEdit() {
    setLocalFields(savedFields.map((f) => ({ ...f })))
    setMode("edit")
  }

  function startAdd() {
    const newId = nextLetterId(savedFields)
    setLocalFields([{ id: newId, description: "", percentage: 0, minHours: 0, initialHours: 0 }])
    setMode("add")
  }

  function cancel() {
    setMode("view")
    setLocalFields([])
  }

  function addAnotherField() {
    const allFields = mode === "add" ? [...savedFields, ...localFields] : localFields
    const newId = nextLetterId(allFields)
    setLocalFields((prev) => [...prev, { id: newId, description: "", percentage: 0, minHours: 0, initialHours: 0 }])
  }

  function updateField(id: string, key: keyof PracticeField, value: string | number) {
    setLocalFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  }

  function handleSave() {
    const invalid = localFields.filter((f) => !f.description.trim() || f.minHours <= 0)
    if (invalid.length > 0) {
      toast.error("All fields need a description and min hours greater than 0")
      return
    }
    const merged = mode === "add" ? reletter([...savedFields, ...localFields]) : reletter(localFields)
    const totalMinHours = merged.reduce((s, f) => s + (f.minHours || 0), 0)
    if (totalMinHours > goalHours) {
      toast.error(
        goalHours === 0
          ? "Set your goal hours first before configuring fields"
          : `Total field hours (${totalMinHours.toLocaleString()}h) exceeds goal hours (${goalHours.toLocaleString()}h)`
      )
      return
    }
    setSaving(true)
    const toastId = toast.loading("Saving fields...")
    saveSettings(
      {
        goalHours: settings?.goalHours ?? 0,
        initialBalance: settings?.initialBalance ?? 0,
        practiceFields: merged,
        mentorInfo: settings?.mentorInfo,
        targetDate: settings?.targetDate ?? null,
        restDays: settings?.restDays,
      },
      {
        onSuccess: () => {
          refetch()
          setSaving(false)
          setMode("view")
          setLocalFields([])
          toast.success("Fields saved", { id: toastId })
        },
        onError: () => {
          setSaving(false)
          toast.error("Failed to save fields", { id: toastId })
        },
      }
    )
  }

  function confirmRemoveField() {
    if (!fieldToDelete) return
    const removed = fieldToDelete
    const filtered = savedFields.filter((f) => f.id !== removed.id)
    const updatedFields = reletter(filtered)
    setFieldToDelete(null)
    setOptimisticFields(updatedFields)
    setDeleting(true)
    const toastId = toast.loading(`Deleting Field ${removed.id}...`)
    saveSettings(
      {
        goalHours: settings?.goalHours ?? 0,
        initialBalance: settings?.initialBalance ?? 0,
        practiceFields: updatedFields,
        mentorInfo: settings?.mentorInfo,
        targetDate: settings?.targetDate ?? null,
        restDays: settings?.restDays,
      },
      {
        onSuccess: () => {
          refetch()
          setDeleting(false)
          setOptimisticFields(null)
          toast.success(`Field ${removed.id} deleted`, { id: toastId })
        },
        onError: () => {
          setDeleting(false)
          setOptimisticFields(null)
          toast.error(`Failed to delete Field ${removed.id}`, { id: toastId })
        },
      }
    )
  }

  if (isLoading) return <ProgressSkeleton />

  if (isError) {
    return (
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <ErrorDisplay title="Error loading progress" description="Failed to load training data." onRetry={refetch} />
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">Goals & Progress</h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            OJT Requirements · Fields of Practice
          </p>
        </div>

        <OjtRequirementsCard totalRendered={totalRendered} />

        <Card className="overflow-hidden border-primary/10 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-primary/5 bg-muted/5 pb-4">
            <div className="flex items-center gap-3">
              <p className="text-base font-bold tracking-tight">Fields of Practice</p>
              {mode !== "view" && goalHours > 0 && (() => {
                const allFields = mode === "add" ? [...savedFields, ...localFields] : localFields
                const total = allFields.reduce((s, f) => s + (f.minHours || 0), 0)
                const over = total > goalHours
                return (
                  <span className={`text-[11px] font-bold tabular-nums ${over ? "text-destructive" : "text-muted-foreground/50"}`}>
                    {total.toLocaleString()}h / {goalHours.toLocaleString()}h
                  </span>
                )
              })()}
            </div>
            {mode === "view" ? (
              <div className="flex items-center gap-2">
                {goalHours === 0 && (
                  <span className="text-[10px] font-semibold text-muted-foreground/50 italic">Set goal hours first</span>
                )}
                {savedFields.length > 0 && (
                  <Button variant="outline" size="sm" onClick={startEdit} disabled={goalHours === 0} className="h-7 gap-1.5 text-[11px] font-bold disabled:opacity-40">
                    <PencilIcon size={11} /> Edit fields
                  </Button>
                )}
                <Button size="sm" onClick={startAdd} disabled={goalHours === 0} className="h-7 gap-1.5 text-[11px] font-bold disabled:opacity-40">
                  <PlusIcon size={11} /> Add field
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cancel} className="h-7 gap-1.5 text-[11px] font-bold">
                  <XIcon size={11} /> Cancel
                </Button>
                <Button variant="outline" size="sm" onClick={addAnotherField} className="h-7 gap-1.5 text-[11px] font-bold">
                  <PlusIcon size={11} /> Add field
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 gap-1.5 text-[11px] font-bold">
                  <SaveIcon size={11} /> {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {/* In add mode: show existing fields read-only above the new ones */}
            {mode === "add" && savedFields.length > 0 && (
              <div className="divide-y divide-border border-b border-border">
                {savedFields.map((field) => (
                  <FieldProgressCard
                    key={field.id}
                    field={field}
                    actualHours={fieldTotals[field.id] ?? 0}
                    onDelete={() => setFieldToDelete(field)}
                  />
                ))}
              </div>
            )}

            {mode !== "view" ? (
              <div className="divide-y divide-border">
                {localFields.map((field) => (
                  <FieldProgressCard
                    key={field.id}
                    field={field}
                    actualHours={0}
                    isEditing
                    onUpdate={(key, value) => updateField(field.id, key, value)}
                    onDelete={localFields.length > 1 ? () => setLocalFields((prev) => prev.filter((f) => f.id !== field.id)) : undefined}
                  />
                ))}
              </div>
            ) : displayFields.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm font-semibold text-muted-foreground">No fields configured yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {displayFields.map((field) => (
                  <FieldProgressCard
                    key={field.id}
                    field={field}
                    actualHours={fieldTotals[field.id] ?? 0}
                    onDelete={() => setFieldToDelete(field)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!fieldToDelete} onOpenChange={(open) => { if (!open) setFieldToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black tracking-tight">
              Remove Field {fieldToDelete?.id}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[12px] leading-relaxed">
              This will remove <strong>Field {fieldToDelete?.id}</strong>
              {fieldToDelete?.description ? ` — ${fieldToDelete.description.split(",")[0]}` : ""}.
              Any logged hours split to this field will no longer appear in progress.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[11px] font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveField}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90 text-[11px] font-bold disabled:opacity-50"
            >
              <Trash2Icon size={13} className="mr-1.5" /> {deleting ? "Deleting..." : "Remove field"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
