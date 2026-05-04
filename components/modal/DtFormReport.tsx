"use client"

import { useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileTextIcon, PrinterIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react"
import { DEFAULT_PRACTICE_FIELDS, PracticeField } from "@/lib/attendance-constants"

interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
  splits?: Record<string, number> | null
}

interface MentorInfo {
  school?: string
  dateOfGraduation?: string
  schoolControlNo?: string
  iapoanNo?: string
  dateIssued?: string
  expiryDate?: string
  deanName?: string
}

interface DtFormReportProps {
  sessions: AttendanceEntry[]
  practiceFields?: PracticeField[]
  goalHours: number
  mentorInfo?: MentorInfo
}

export function DtFormReport({
  sessions,
  practiceFields,
  goalHours,
  mentorInfo,
}: DtFormReportProps) {
  const fields = practiceFields?.length ? practiceFields : DEFAULT_PRACTICE_FIELDS

  const aggregated = useMemo(() => {
    const totals: Record<string, number> = {}
    fields.forEach((f) => (totals[f.id] = 0))

    sessions.forEach((session) => {
      if (!session.splits || !session.clockOut) return
      fields.forEach((field) => {
        totals[field.id] += session.splits?.[field.id] || 0
      })
    })

    return totals
  }, [sessions, fields])

  const grandTotal = Object.values(aggregated).reduce((s, v) => s + v, 0)

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 text-[11px] font-bold border-primary/20 hover:bg-primary/5 rounded-lg"
        >
          <FileTextIcon size={14} /> DT Form 001
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-lg font-black tracking-tight">
              DT Form 001 — Log Sheet
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-[11px] font-bold border-primary/20 print:hidden"
            >
              <PrinterIcon size={12} /> Print
            </Button>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
            Log Sheet of Diversified Training for Architects Licensure Examination
          </p>
        </DialogHeader>

        {/* Report header */}
        <div className="border border-primary/10 rounded-xl overflow-hidden">
          <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
            <p className="text-[11px] font-black tracking-widest uppercase text-primary/80 text-center">
              Summary
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/40 border-b border-primary/10">
                  <th className="text-left px-4 py-3 font-black text-foreground/80 w-[40%]">
                    Field of Practice
                  </th>
                  <th className="text-center px-3 py-3 font-black text-foreground/80 w-[10%]">
                    % (Max.)
                  </th>
                  <th className="text-center px-3 py-3 font-black text-foreground/80 w-[15%]">
                    Min. Credit Hrs
                  </th>
                  <th className="text-center px-3 py-3 font-black text-foreground/80 w-[20%]">
                    Total Hrs Accomplished
                  </th>
                  <th className="text-center px-3 py-3 font-black text-foreground/80 w-[15%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, i) => {
                  const accomplished = aggregated[field.id] || 0
                  const met = accomplished >= field.minHours
                  return (
                    <tr
                      key={field.id}
                      className={`border-b border-primary/5 ${i % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 size-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <span className="text-[9px] font-black text-primary">
                              {field.id}
                            </span>
                          </span>
                          <span className="text-foreground/80 font-medium leading-snug">
                            {field.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-foreground/70">
                        {field.percentage}%
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-foreground/70">
                        {field.minHours.toLocaleString()} hrs
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`font-black text-sm ${met ? "text-primary" : accomplished > 0 ? "text-amber-500" : "text-muted-foreground/40"}`}
                        >
                          {accomplished.toFixed(1)}
                        </span>
                        <span className="text-[9px] font-medium text-muted-foreground/50 ml-0.5">
                          hrs
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {met ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <CheckCircle2Icon size={10} /> Met
                          </span>
                        ) : accomplished > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <AlertCircleIcon size={10} />{" "}
                            {((accomplished / field.minHours) * 100).toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-muted-foreground/30">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {/* Total row */}
                <tr className="bg-primary/5 border-t-2 border-primary/20">
                  <td className="px-4 py-3 font-black text-foreground text-[12px]">
                    TOTAL
                  </td>
                  <td className="px-3 py-3 text-center font-black text-foreground">
                    100%
                  </td>
                  <td className="px-3 py-3 text-center font-black text-foreground">
                    {fields
                      .reduce((s, f) => s + f.minHours, 0)
                      .toLocaleString()}{" "}
                    hrs
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-black text-primary text-sm">
                      {grandTotal.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-medium text-muted-foreground/50 ml-0.5">
                      hrs
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-[10px] font-bold text-muted-foreground/60">
                      {goalHours > 0
                        ? `${Math.min((grandTotal / goalHours) * 100, 100).toFixed(0)}% of goal`
                        : "—"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mentor / PRC info */}
        {mentorInfo && Object.values(mentorInfo).some(Boolean) && (
          <div className="border border-primary/10 rounded-xl p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Candidate Information
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                { label: "School", value: mentorInfo.school },
                { label: "Attested By (Dean/Head)", value: mentorInfo.deanName },
                { label: "Date of Graduation", value: mentorInfo.dateOfGraduation },
                { label: "School Control No.", value: mentorInfo.schoolControlNo },
                { label: "IAPOA No.", value: mentorInfo.iapoanNo },
                { label: "Date Issued", value: mentorInfo.dateIssued },
                { label: "Expiry Date", value: mentorInfo.expiryDate },
              ]
                .filter((r) => r.value)
                .map((r) => (
                  <div key={r.label} className="space-y-0.5">
                    <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-wider">{r.label}</p>
                    <p className="text-[11px] font-semibold text-foreground">{r.value}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Unallocated hours note */}
        {(() => {
          const totalSessionHours = sessions.reduce((sum, s) => {
            if (!s.clockOut) return sum
            const diff =
              (new Date(s.clockOut).getTime() -
                new Date(s.clockIn).getTime()) /
              3600000
            return sum + Math.max(diff - (s.break || 0) / 3600, 0)
          }, 0)
          const unallocated = Math.max(totalSessionHours - grandTotal, 0)
          if (unallocated < 0.01) return null
          return (
            <p className="text-[10px] font-semibold text-muted-foreground/50 text-center">
              {unallocated.toFixed(1)}h of logged time has not been allocated to
              any field.
            </p>
          )
        })()}

        <p className="text-[9px] text-muted-foreground/40 font-medium text-center leading-relaxed">
          NOTE: Trainee must accomplish the minimum number of hours required
          credit for each field of practice of architecture as defined in R.A.
          9266. Excess of credit hours in one specific field will not be credited
          to other fields of practice.
        </p>
      </DialogContent>
    </Dialog>
  )
}
