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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  HistoryIcon, SaveIcon, Settings2Icon, TargetIcon,
  RotateCcwIcon, BookOpenIcon, UserCheckIcon, CalendarIcon,
} from "lucide-react"
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
  const { mutate: saveSettings, isPending } = usePutSettings()

  const [initialHours, setInitialHours] = useState("")
  const [goalHours, setGoalHours] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [practiceFields, setPracticeFields] = useState<PracticeField[]>(DEFAULT_PRACTICE_FIELDS)
  const [mentor, setMentor] = useState<MentorInfo>(EMPTY_MENTOR)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (settingsData && !hydrated) {
      setInitialHours(settingsData.initialBalance?.toString() || "")
      setGoalHours(settingsData.goalHours?.toString() || "")
      setTargetDate(settingsData.targetDate?.slice(0, 10) || "")
      setPracticeFields(settingsData.practiceFields ?? DEFAULT_PRACTICE_FIELDS)
      setMentor({ ...EMPTY_MENTOR, ...(settingsData.mentorInfo ?? {}) })
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

  function save(extra?: object) {
    saveSettings(
      {
        goalHours: Number(goalHours) || 40,
        initialBalance: Number(initialHours) || 0,
        practiceFields,
        mentorInfo: mentor,
        targetDate: targetDate || null,
        ...extra,
      },
      { onSuccess: () => refetch() }
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
        <ErrorDisplay title="Error loading settings" description="Failed to load settings." onRetry={refetch} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 lg:p-8">
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
          <BalanceCalculator onApply={(v) => setInitialHours(v.toString())} />
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
            <Button onClick={() => save()} disabled={isPending}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {isPending ? "Saving..." : "Save requirements"}
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
            <Button onClick={() => save()} disabled={isPending}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {isPending ? "Saving..." : "Save info"}
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
          <Button variant="outline" size="sm" onClick={() => setPracticeFields(DEFAULT_PRACTICE_FIELDS)}
            className="h-8 gap-1.5 text-[11px] font-bold border-primary/20 hover:bg-primary/5">
            <RotateCcwIcon size={12} /> Reset defaults
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="hidden md:grid grid-cols-[2rem_1fr_5rem_6rem] gap-3 px-4 pb-1">
            <span />
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider">Description</span>
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">% (Max)</span>
            <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider text-center">Min Hrs</span>
          </div>
          {practiceFields.map((field) => (
            <div key={field.id} className="grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_1fr_5rem_6rem] gap-3 items-center rounded-xl border border-primary/5 bg-muted/20 px-4 py-3">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-black text-primary">{field.id}</span>
              </div>
              <Input value={field.description} onChange={(e) => updateField(field.id, "description", e.target.value)}
                className="h-8 text-[12px] font-medium border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
              <Input type="number" min="0" max="100" value={field.percentage}
                onChange={(e) => updateField(field.id, "percentage", parseFloat(e.target.value) || 0)}
                className="h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
              <Input type="number" min="0" value={field.minHours}
                onChange={(e) => updateField(field.id, "minHours", parseFloat(e.target.value) || 0)}
                className="h-8 text-[12px] font-bold text-center border-primary/10 focus-visible:ring-primary rounded-lg bg-background" />
            </div>
          ))}
          <div className={`flex items-center justify-end gap-2 px-4 pt-1 text-[11px] font-bold ${totalPct === 100 ? "text-primary" : "text-destructive"}`}>
            <span className="text-muted-foreground/50 font-medium">Total %:</span>
            <span>{totalPct}%</span>
            {totalPct !== 100 && <span className="text-[10px] font-medium text-destructive/70">(should be 100%)</span>}
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Button onClick={() => save()} disabled={isPending}
              className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50">
              <SaveIcon size={14} /> {isPending ? "Saving..." : "Save fields"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
