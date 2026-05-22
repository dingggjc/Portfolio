"use client"

import { format } from "date-fns"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DtFormReport } from "@/components/modal/DtFormReport"
import { ManualEntryDialog } from "@/components/modal/ManualEntryDialog"
import { PracticeField } from "@/lib/attendance-constants"

interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
  splits?: Record<string, number> | null
  notes?: string | null
}

interface AttendanceHeaderProps {
  sessions: AttendanceEntry[]
  practiceFields: PracticeField[]
  targetHours: number
  mentorInfo: Record<string, string> | undefined
  onManualAdd: (entry: {
    date: string
    clock_in: string
    clock_out: string
    break_minutes: number
  }) => void
}

export function AttendanceHeader({
  sessions,
  practiceFields,
  targetHours,
  mentorInfo,
  onManualAdd,
}: AttendanceHeaderProps) {
  function handleExportCSV() {
    const rows = [
      ["Date", "Clock In", "Clock Out", "Break (min)", "Net Hours", "Status", "Notes", "Splits"],
      ...sessions
        .filter((e) => e.clockOut)
        .map((e) => {
          const gross =
            (new Date(e.clockOut!).getTime() - new Date(e.clockIn).getTime()) / 3600000
          const net = Math.max(gross - (e.break || 0) / 3600, 0)
          const splitsStr = e.splits
            ? Object.entries(e.splits)
                .filter(([, v]) => (v as number) > 0)
                .map(([k, v]) => `${k}:${(v as number).toFixed(2)}h`)
                .join(" | ")
            : ""
          return [
            e.data?.slice(0, 10) ?? "",
            format(new Date(e.clockIn), "HH:mm"),
            format(new Date(e.clockOut!), "HH:mm"),
            Math.round((e.break || 0) / 60),
            net.toFixed(2),
            e.status,
            `"${(e.notes ?? "").replace(/"/g, '""')}"`,
            splitsStr,
          ]
        }),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-log-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Attendance Log</h1>
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
          Live data mode • Training performance
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DtFormReport
          sessions={sessions}
          practiceFields={practiceFields}
          goalHours={targetHours}
          mentorInfo={mentorInfo}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="h-9 gap-2 text-[11px] font-bold border-primary/20 hover:bg-primary/5 rounded-lg"
        >
          <DownloadIcon size={14} /> Export CSV
        </Button>
        <ManualEntryDialog onAdd={onManualAdd} />
      </div>
    </div>
  )
}
