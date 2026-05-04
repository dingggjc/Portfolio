"use client"

import { useEffect, useState } from "react"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { usePutSettings } from "@/app/hooks/attendance/usePutSettings"
import BalanceCalculator from "@/components/modal/BalanceCalculator"
import { ErrorDisplay } from "@/components/reusables/error-display"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  HistoryIcon, SaveIcon, Settings2Icon, TargetIcon,
  RotateCcwIcon, BookOpenIcon, UserCheckIcon, CalendarIcon,
  PlusIcon, Trash2Icon, CalendarDaysIcon,
} from "lucide-react"
import { toast } from "sonner"
import { DEFAULT_PRACTICE_FIELDS, PracticeField } from "@/lib/attendance-constants"

interface MentorInfo {
  school: string
  dateOfGraduation: string
  schoolControlNo: string
  iapoanNo: string
  dateIssued: string
  expiryDate: string
  deanName: string
}

const EMPTY_MENTOR: MentorInfo = {
  school: "", dateOfGraduation: "", schoolControlNo: "",
  iapoanNo: "", dateIssued: "", expiryDate: "", deanName: "",
}

export default function SettingsPage() {
  const { data: settingsData, isLoading, isError, refetch } = useGetSettings()
  const { mutate: saveSettings } = usePutSettings()

  const [initialHours, setInitialHours] = useState("")
  const [goalHours, setGoalHours] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [practiceFields, setPracticeFields] = useState<PracticeField[]>(DEFAULT_PRACTICE_FIELDS)
  const [mentor, setMentor] = useState<MentorInfo>(EMPTY_MENTOR)
  const [restDays, setRestDays] = useState<number[]>([0, 6])
  const [hydrated, setHydrated] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<PracticeField | null>(null)
  const [savingSection, setSavingSection] = useState<"requirements" | "mentor" | "fields" | "schedule" | null>(null)

  useEffect(() => {
    if (settingsData && !hydrated) {
      setInitialHours(settingsData.initialBalance?.toString() || "")
      setGoalHours(settingsData.goalHours?.toString() || "")
      setTargetDate(settingsData.targetDate?.slice(0, 10) || "")
      setPracticeFields(settingsData.practiceFields ?? DEFAULT_PRACTICE_FIELDS)
      setMentor({ ...EMPTY_MENTOR, ...(settingsData.mentorInfo ?? {}) })
      setRestDays(settingsData.restDays ?? [0, 6])
      setHydrated(true)
    }
  }, [settingsData, hydrated])

  const totalPct = practiceFields.reduce((s, f) => s + (Number(f.percentage) || 0), 0)

  function updateField(id: string, key: keyof PracticeField, value: string | number) {
    setPracticeFields((prev) => prev.map((f) => f.id === id ? { ...f, [key]: value } : f))
  }

  function updateMentor(key: keyof MentorInfo, value: string) {
    setMentor((prev) => ({ ...prev, [key]: value }))
  }

  function addField() {
    const letterIds = practiceFields.map((f) => f.id).filter((id) => /^[A-Z]$/.test(id)).sort()
    const last = letterIds.at(-1)
    const nextId = last && last < "Z" ? String.fromCharCode(last.charCodeAt(0) + 1) : `${practiceFields.length + 1}`
    setPracticeFields((prev) => [...prev, { id: nextId, description: "", percentage: 0, minHours: 0, initialHours: 0 }])
  }

  function confirmRemoveField() {
    if (!fieldToDelete) return
    const updatedFields = practiceFields.filter((f) => f.id !== fieldToDelete.id)
    const removedId = fieldToDelete.id
    setFieldToDelete(null)
    setPracticeFields(updatedFields)
    saveSettings(
      {
        goalHours: Number(goalHours) || 40,
        initialBalance: Number(initialHours) || 0,
        practiceFields: updatedFields,
        mentorInfo: mentor,
        targetDate: targetDate || null,
        restDays,
      },
      {
        onSuccess: () => {
          refetch()
          toast.success(`Field ${removedId} removed and saved`)
        },
        onError: () => {
          setPracticeFields(practiceFields)
          toast.error("Failed to remove field — changes reverted")
        },
      }
    )
  }

  function save(section: "requirements" | "mentor" | "fields", extra?: object) {
    setSavingSection(section)
    saveSettings(
      {
        goalHours: Number(goalHours) || 40,
        initialBalance: Number(initialHours) || 0,
        practiceFields,
        mentorInfo: mentor,
        targetDate: targetDate || null,
        restDays,
        ...extra,
      },
      {
        onSuccess: () => { refetch(); setSavingSection(null) },
        onError: () => setSavingSection(null),
      }
    )
  }

  if (isError) {
    return (
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <ErrorDisplay title="Error loading settings" description="Failed to load settings." onRetry={refetch} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
        <Skeleton className="h-9 w-48" />
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-primary/10">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
          Configuration • Training System
        </p>
      </div>

      {/* OJT Requirements */}
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
              <Input id="initial_hours" type="number" value={initialHours}
                onChange={(e) => setInitialHours(e.target.value)} placeholder="0"
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                <TargetIcon size={12} className="text-primary" />
                <Label htmlFor="goal_hours">Goal hours (Target)</Label>
              </div>
              <Input id="goal_hours" type="number" value={goalHours}
                onChange={(e) => setGoalHours(e.target.value)} placeholder="3840"
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                <CalendarIcon size={12} className="text-primary" />
                <Label htmlFor="target_date">Target completion date</Label>
              </div>
              <Input id="target_date" type="date" value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary" />
            </div>
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button onClick={() => save("requirements")} disabled={savingSection === "requirements"}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {savingSection === "requirements" ? "Saving..." : "Save requirements"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentor / PRC Info */}
      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="border-b border-primary/5 bg-muted/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <UserCheckIcon size={18} className="text-primary" /> Mentor & PRC Info
          </CardTitle>
          <CardDescription className="text-[11px] font-medium italic opacity-70">
            Pre-fills the DT Form 001 report. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-5 md:grid-cols-2">
            {(
              [
                { key: "school", label: "School / University", placeholder: "University of the Philippines" },
                { key: "deanName", label: "Dean / Dept Head name", placeholder: "Arch. Juan dela Cruz" },
                { key: "dateOfGraduation", label: "Date of Graduation", type: "date" },
                { key: "schoolControlNo", label: "School Control No.", placeholder: "UP-2024-001" },
                { key: "iapoanNo", label: "IAPOA No.", placeholder: "IAPOA-XXXX-XXXX-XXXX" },
                { key: "dateIssued", label: "Date Issued", type: "date" },
                { key: "expiryDate", label: "Expiry Date", type: "date" },
              ] as { key: keyof MentorInfo; label: string; placeholder?: string; type?: string }[]
            ).map(({ key, label, placeholder, type }) => (
              <div key={key} className="space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground/80">
                  <Label>{label}</Label>
                </div>
                <Input
                  type={type || "text"}
                  value={mentor[key]}
                  onChange={(e) => updateMentor(key, e.target.value)}
                  placeholder={placeholder}
                  className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button onClick={() => save("mentor")} disabled={savingSection === "mentor"}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {savingSection === "mentor" ? "Saving..." : "Save info"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Practice Fields */}
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
            <Button variant="outline" size="sm" onClick={addField}
              className="h-8 gap-1.5 text-[11px] font-bold border-primary/20 hover:bg-primary/5">
              <PlusIcon size={12} /> Add field
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPracticeFields(DEFAULT_PRACTICE_FIELDS)}
              className="h-8 gap-1.5 text-[11px] font-bold border-primary/20 hover:bg-primary/5">
              <RotateCcwIcon size={12} /> Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="hidden md:grid grid-cols-[2rem_1fr_5rem_6rem_2rem] gap-3 px-4 pb-1">
            <span />
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider">Description</span>
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">% (Max)</span>
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">Min Hrs</span>
            <span />
          </div>
          {practiceFields.map((field) => (
            <div key={field.id} className="grid grid-cols-[2rem_1fr_2rem] md:grid-cols-[2rem_1fr_5rem_6rem_2rem] gap-3 items-center rounded-xl border border-primary/5 bg-muted/20 px-4 py-3">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-black text-primary">{field.id}</span>
              </div>
              <Input value={field.description} onChange={(e) => updateField(field.id, "description", e.target.value)}
                className="h-8 text-[12px] font-medium border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
              <Input type="number" min="0" max="100" value={field.percentage}
                onChange={(e) => updateField(field.id, "percentage", parseFloat(e.target.value) || 0)}
                className="hidden md:block h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
              <Input type="number" min="0" value={field.minHours}
                onChange={(e) => updateField(field.id, "minHours", parseFloat(e.target.value) || 0)}
                className="hidden md:block h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
              <button
                onClick={() => setFieldToDelete(field)}
                className="size-7 flex items-center justify-center rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2Icon size={13} />
              </button>
            </div>
          ))}
          <div className={`flex items-center justify-end gap-2 px-4 pt-1 text-[11px] font-bold ${totalPct === 100 ? "text-primary" : "text-destructive"}`}>
            <span className="text-muted-foreground/50 font-medium">Total %:</span>
            <span>{totalPct}%</span>
            {totalPct !== 100 && <span className="text-[10px] font-medium text-destructive/70">(should be 100%)</span>}
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button onClick={() => save("fields")} disabled={savingSection === "fields"}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {savingSection === "fields" ? "Saving..." : "Save fields"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Schedule */}
      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="border-b border-primary/5 bg-muted/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <CalendarDaysIcon size={18} className="text-primary" /> Work Schedule
          </CardTitle>
          <CardDescription className="text-[11px] font-medium italic opacity-70">
            Mark your rest days — they won&apos;t break your attendance streak.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">Select rest days (days off)</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Sun", value: 0 },
                { label: "Mon", value: 1 },
                { label: "Tue", value: 2 },
                { label: "Wed", value: 3 },
                { label: "Thu", value: 4 },
                { label: "Fri", value: 5 },
                { label: "Sat", value: 6 },
              ].map((day) => {
                const isRest = restDays.includes(day.value)
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() =>
                      setRestDays((prev) =>
                        isRest ? prev.filter((d) => d !== day.value) : [...prev, day.value]
                      )
                    }
                    className={`h-10 w-14 rounded-xl text-[11px] font-black tracking-wide border transition-all duration-150 select-none
                      ${isRest
                        ? "border-primary/20 bg-muted/40 text-muted-foreground/40 line-through"
                        : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            <p className="text-[10px] text-muted-foreground/40 font-medium">
              {restDays.length === 0
                ? "No rest days — streak counts every day"
                : `Rest days: ${restDays.sort().map(d => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(", ")} · Streak skips these`}
            </p>
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button onClick={() => save("schedule")} disabled={savingSection === "schedule"}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {savingSection === "schedule" ? "Saving..." : "Save schedule"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!fieldToDelete} onOpenChange={(open) => { if (!open) setFieldToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black tracking-tight">Remove Field {fieldToDelete?.id}?</AlertDialogTitle>
            <AlertDialogDescription className="text-[12px] leading-relaxed">
              This will remove <strong>Field {fieldToDelete?.id}</strong>
              {fieldToDelete?.description ? ` — ${fieldToDelete.description.split(",")[0]}` : ""}.
              Any logged hours split to this field will no longer appear in progress charts.
              This action cannot be undone without resetting to defaults.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[11px] font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveField}
              className="bg-destructive text-white hover:bg-destructive/90 text-[11px] font-bold"
            >
              <Trash2Icon size={13} className="mr-1.5" /> Remove field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
