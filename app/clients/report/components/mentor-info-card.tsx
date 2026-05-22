"use client"

import { useEffect, useState } from "react"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { usePutSettings } from "@/app/hooks/attendance/usePutSettings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SaveIcon, UserCheckIcon } from "lucide-react"
import { toast } from "sonner"

interface MentorInfo {
  school: string
  dateOfGraduation: string
  schoolControlNo: string
  iapoanNo: string
  dateIssued: string
  expiryDate: string
  deanName: string
}

const EMPTY: MentorInfo = {
  school: "", dateOfGraduation: "", schoolControlNo: "",
  iapoanNo: "", dateIssued: "", expiryDate: "", deanName: "",
}

const FIELDS: { key: keyof MentorInfo; label: string; placeholder?: string; type?: string }[] = [
  { key: "school",           label: "School / University",  placeholder: "University of the Philippines" },
  { key: "deanName",         label: "Supervising Architect / Mentor", placeholder: "Arch. Juan dela Cruz" },
  { key: "dateOfGraduation", label: "Date of Graduation",   type: "date" },
  { key: "schoolControlNo",  label: "School Control No.",   placeholder: "UP-2024-001" },
  { key: "iapoanNo",         label: "IAPOA No.",            placeholder: "IAPOA-XXXX-XXXX-XXXX" },
  { key: "dateIssued",       label: "Date Issued",          type: "date" },
  { key: "expiryDate",       label: "Expiry Date",          type: "date" },
]

export function MentorInfoCard() {
  const { data: settings, refetch } = useGetSettings()
  const { mutate: saveSettings } = usePutSettings()

  const [mentor, setMentor] = useState<MentorInfo>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (settings && !hydrated) {
      setMentor({ ...EMPTY, ...(settings.mentorInfo ?? {}) })
      setHydrated(true)
    }
  }, [settings, hydrated])

  function update(key: keyof MentorInfo, value: string) {
    setMentor((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    setSaving(true)
    const toastId = toast.loading("Saving info...")
    saveSettings(
      {
        goalHours: settings?.goalHours ?? 0,
        initialBalance: settings?.initialBalance ?? 0,
        practiceFields: settings?.practiceFields,
        mentorInfo: mentor,
        targetDate: settings?.targetDate ?? null,
        restDays: settings?.restDays,
      },
      {
        onSuccess: () => {
          refetch()
          setSaving(false)
          toast.success("Info saved", { id: toastId })
        },
        onError: () => {
          setSaving(false)
          toast.error("Failed to save", { id: toastId })
        },
      }
    )
  }

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-primary/5 bg-muted/5 pb-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <UserCheckIcon size={18} className="text-primary" /> Mentor & PRC Info
          </CardTitle>
          <CardDescription className="text-[11px] font-medium italic opacity-70">
            Pre-fills the DT Form 001 report. All fields are optional.
          </CardDescription>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold"
        >
          <SaveIcon size={13} />
          {saving ? "Saving..." : "Save"}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-5 md:grid-cols-2">
          {FIELDS.map(({ key, label, placeholder, type }) => (
            <div key={key} className="space-y-2">
              <Label className="text-[11px] font-bold text-muted-foreground/80">{label}</Label>
              <Input
                type={type ?? "text"}
                value={mentor[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
