"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { PracticeField } from "@/lib/attendance-constants"
import { EMPTY_MENTOR, MentorInfo, SavingSection } from "./types"

interface SettingsData {
  initialBalance?: number
  goalHours?: number
  targetDate?: string | null
  practiceFields?: PracticeField[]
  mentorInfo?: Partial<MentorInfo>
  restDays?: number[]
}

interface SettingsContextValue {
  initialHours: string
  goalHours: string
  targetDate: string
  practiceFields: PracticeField[]
  mentor: MentorInfo
  restDays: number[]
  savingSection: SavingSection
  fieldToDelete: PracticeField | null
  totalPct: number
  setInitialHours: (v: string) => void
  setGoalHours: (v: string) => void
  setTargetDate: (v: string) => void
  setPracticeFields: React.Dispatch<React.SetStateAction<PracticeField[]>>
  setRestDays: React.Dispatch<React.SetStateAction<number[]>>
  setFieldToDelete: (f: PracticeField | null) => void
  updateField: (id: string, key: keyof PracticeField, value: string | number) => void
  updateMentor: (key: keyof MentorInfo, value: string) => void
  addField: () => void
  confirmRemoveField: () => void
  save: (section: NonNullable<SavingSection>, extra?: Partial<SavePayload>) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider")
  return ctx
}

type SavePayload = {
  goalHours: number
  initialBalance: number
  practiceFields?: object
  mentorInfo?: object
  targetDate?: string | null
  restDays?: number[]
}

interface Props {
  children: React.ReactNode
  settingsData: SettingsData | undefined
  saveSettings: (payload: SavePayload, options?: { onSuccess?: () => void; onError?: (err: Error) => void }) => void
  refetch: () => void
}

export function SettingsProvider({ children, settingsData, saveSettings, refetch }: Props) {
  const [initialHours, setInitialHours] = useState("")
  const [goalHours, setGoalHours] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [practiceFields, setPracticeFields] = useState<PracticeField[]>([])
  const [mentor, setMentor] = useState<MentorInfo>(EMPTY_MENTOR)
  const [restDays, setRestDays] = useState<number[]>([0, 6])
  const [hydrated, setHydrated] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<PracticeField | null>(null)
  const [savingSection, setSavingSection] = useState<SavingSection>(null)

  useEffect(() => {
    if (settingsData && !hydrated) {
      setInitialHours(settingsData.initialBalance?.toString() || "")
      setGoalHours(settingsData.goalHours?.toString() || "")
      setTargetDate(settingsData.targetDate?.slice(0, 10) || "")
      setPracticeFields(settingsData.practiceFields ?? [])
      setMentor({ ...EMPTY_MENTOR, ...(settingsData.mentorInfo ?? {}) })
      setRestDays(settingsData.restDays ?? [0, 6])
      setHydrated(true)
    }
  }, [settingsData, hydrated])

  const totalPct = practiceFields.reduce((s, f) => s + (Number(f.percentage) || 0), 0)

  function buildPayload(extra?: Partial<SavePayload>): SavePayload {
    return {
      goalHours: Number(goalHours) || 0,
      initialBalance: Number(initialHours) || 0,
      practiceFields,
      mentorInfo: mentor,
      targetDate: targetDate || null,
      restDays,
      ...extra,
    }
  }

  function updateField(id: string, key: keyof PracticeField, value: string | number) {
    setPracticeFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  }

  function updateMentor(key: keyof MentorInfo, value: string) {
    setMentor((prev) => ({ ...prev, [key]: value }))
  }

  function addField() {
    const letterIds = practiceFields.map((f) => f.id).filter((id) => /^[A-Z]$/.test(id)).sort()
    const last = letterIds.at(-1)
    const nextId =
      last && last < "Z"
        ? String.fromCharCode(last.charCodeAt(0) + 1)
        : `${practiceFields.length + 1}`
    setPracticeFields((prev) => [
      ...prev,
      { id: nextId, description: "", percentage: 0, minHours: 0, initialHours: 0 },
    ])
  }

  function confirmRemoveField() {
    if (!fieldToDelete) return
    const filtered = practiceFields.filter((f) => f.id !== fieldToDelete.id)
    const updatedFields = filtered.map((f, i) => ({ ...f, id: String.fromCharCode(65 + i) }))
    const removedId = fieldToDelete.id
    setFieldToDelete(null)
    setPracticeFields(updatedFields)
    saveSettings(
      { ...buildPayload(), practiceFields: updatedFields },
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

  function save(section: NonNullable<SavingSection>, extra?: Partial<SavePayload>) {
    setSavingSection(section)
    saveSettings(buildPayload(extra), {
      onSuccess: () => {
        refetch()
        setSavingSection(null)
        toast.success("Settings saved")
      },
      onError: (err: Error) => {
        setSavingSection(null)
        toast.error(err.message)
      },
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        initialHours, goalHours, targetDate, practiceFields, mentor,
        restDays, savingSection, fieldToDelete, totalPct,
        setInitialHours, setGoalHours, setTargetDate,
        setPracticeFields, setRestDays, setFieldToDelete,
        updateField, updateMentor, addField, confirmRemoveField, save,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
