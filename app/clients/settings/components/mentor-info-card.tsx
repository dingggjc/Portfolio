"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SaveIcon, UserCheckIcon } from "lucide-react"
import { MentorInfo } from "./types"
import { useSettings } from "./settings-context"

const MENTOR_FIELDS: { key: keyof MentorInfo; label: string; placeholder?: string; type?: string }[] = [
  { key: "school", label: "School / University", placeholder: "University of the Philippines" },
  { key: "deanName", label: "Dean / Dept Head name", placeholder: "Arch. Juan dela Cruz" },
  { key: "dateOfGraduation", label: "Date of Graduation", type: "date" },
  { key: "schoolControlNo", label: "School Control No.", placeholder: "UP-2024-001" },
  { key: "iapoanNo", label: "IAPOA No.", placeholder: "IAPOA-XXXX-XXXX-XXXX" },
  { key: "dateIssued", label: "Date Issued", type: "date" },
  { key: "expiryDate", label: "Expiry Date", type: "date" },
]

export function MentorInfoCard() {
  const { mentor, savingSection, updateMentor, save } = useSettings()

  return (
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
          {MENTOR_FIELDS.map(({ key, label, placeholder, type }) => (
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
          <Button
            onClick={() => save("mentor")}
            disabled={savingSection === "mentor"}
            className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={14} />
            {savingSection === "mentor" ? "Saving..." : "Save info"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
