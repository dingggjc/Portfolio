"use client"

import { useMemo } from "react"
import { format, differenceInCalendarDays } from "date-fns"
import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { useUserProfile } from "@/app/hooks/useUserProfile"
import { DEFAULT_PRACTICE_FIELDS } from "@/lib/attendance-constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PrinterIcon, DownloadIcon } from "lucide-react"

interface Session {
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  splits?: Record<string, number> | null
}

function getNetHours(s: Session) {
  if (!s.clockOut) return 0
  const gross = (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / 3600000
  return Math.max(gross - (s.break || 0) / 3600, 0)
}

export default function ReportPage() {
  const { data: sessions = [], isLoading: sessionsLoading } = useGetSession()
  const { data: settings, isLoading: settingsLoading } = useGetSettings()
  const { data: profile, isLoading: profileLoading } = useUserProfile()

  const isLoading = sessionsLoading || settingsLoading || profileLoading

  const practiceFields = settings?.practiceFields ?? DEFAULT_PRACTICE_FIELDS
  const goalHours = settings?.goalHours ?? 3840
  const initialBalance = settings?.initialBalance ?? 0
  const mentorInfo = settings?.mentorInfo ?? {}
  const targetDate = settings?.targetDate

  const { fieldTotals, totalActual, firstDate, lastDate } = useMemo(() => {
    const completed = (sessions as Session[]).filter((s) => s.clockOut)
    const totals: Record<string, number> = {}
    practiceFields.forEach((f) => { totals[f.id] = f.initialHours ?? 0 })
    completed.forEach((s) => {
      if (!s.splits) return
      practiceFields.forEach((f) => { totals[f.id] += s.splits?.[f.id] || 0 })
    })

    const totalActual = Object.values(totals).reduce((a, b) => a + b, 0) + initialBalance
    const sorted = completed.sort((a, b) => new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime())
    const firstDate = sorted[0] ? format(new Date(sorted[0].clockIn), "MMMM d, yyyy") : "—"
    const lastDate = sorted.at(-1) ? format(new Date(sorted.at(-1)!.clockIn), "MMMM d, yyyy") : "—"

    return { fieldTotals: totals, totalActual, firstDate, lastDate }
  }, [sessions, practiceFields, initialBalance])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const generatedDate = format(new Date(), "MMMM d, yyyy")

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background/95 backdrop-blur px-6 py-3">
        <div>
          <h1 className="text-lg font-black tracking-tight">DT Form 001 — Diversified Training Record</h1>
          <p className="text-[11px] text-muted-foreground/60 font-medium">Preview before printing or saving as PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.print()}
            className="h-9 gap-2 rounded-lg bg-primary px-5 text-[11px] font-bold text-white"
          >
            <PrinterIcon size={14} /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Form — this is what gets printed */}
      <div className="mx-auto max-w-4xl p-8 print:p-0 print:max-w-none">
        <div className="bg-white text-black rounded-xl border border-gray-200 p-10 print:rounded-none print:border-none print:shadow-none shadow-md">

          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">Republic of the Philippines</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">Professional Regulation Commission</p>
            <h2 className="text-xl font-black tracking-tight mt-2">DIVERSIFIED TRAINING RECORD</h2>
            <p className="text-sm font-bold text-gray-600 mt-0.5">DT Form 001</p>
            <p className="text-[10px] text-gray-500 mt-1">
              Required for application for registration as Registered Architect (RA) under R.A. No. 9266
            </p>
          </div>

          {/* Trainee & Training Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Trainee Information</h3>
              <InfoRow label="Name" value={profile?.name ?? "—"} />
              <InfoRow label="Email" value={profile?.email ?? "—"} />
              <InfoRow label="School / University" value={mentorInfo.school ?? "—"} />
              <InfoRow label="Date of Graduation" value={mentorInfo.dateOfGraduation ? format(new Date(mentorInfo.dateOfGraduation), "MMMM d, yyyy") : "—"} />
              <InfoRow label="School Control No." value={mentorInfo.schoolControlNo ?? "—"} />
              <InfoRow label="IAPOA No." value={mentorInfo.iapoanNo ?? "—"} />
              <InfoRow label="Date Issued" value={mentorInfo.dateIssued ? format(new Date(mentorInfo.dateIssued), "MMMM d, yyyy") : "—"} />
              <InfoRow label="Expiry Date" value={mentorInfo.expiryDate ? format(new Date(mentorInfo.expiryDate), "MMMM d, yyyy") : "—"} />
            </div>
            <div className="space-y-2">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Training Period</h3>
              <InfoRow label="Date Started" value={firstDate} />
              <InfoRow label="Last Session" value={lastDate} />
              <InfoRow label="Target Completion" value={targetDate ? format(new Date(targetDate), "MMMM d, yyyy") : "—"} />
              <InfoRow label="Days Remaining" value={targetDate ? `${Math.max(differenceInCalendarDays(new Date(targetDate), new Date()), 0)} days` : "—"} />
              <InfoRow label="Goal Hours" value={`${goalHours.toLocaleString()} hours`} />
              <InfoRow label="Initial Balance" value={`${initialBalance.toFixed(1)} hours`} />
              <InfoRow label="Total Rendered" value={`${totalActual.toFixed(2)} hours`} />
              <InfoRow label="Report Generated" value={generatedDate} />
            </div>
          </div>

          {/* Supervisor Info */}
          <div className="mb-8 space-y-2 text-sm">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Supervising Architect / Mentor</h3>
            <div className="grid grid-cols-2 gap-8">
              <InfoRow label="Name" value={mentorInfo.deanName ?? "—"} />
            </div>
          </div>

          {/* Training Hours Table */}
          <div className="mb-8">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Field Hours Distribution</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider w-10">Field</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider">Description of Architectural Practice</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-[10px] font-black uppercase tracking-wider w-20">Req. %</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-[10px] font-black uppercase tracking-wider w-24">Min. Hrs</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-[10px] font-black uppercase tracking-wider w-24">Actual Hrs</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-[10px] font-black uppercase tracking-wider w-20">Actual %</th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-[10px] font-black uppercase tracking-wider w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {practiceFields.map((field, i) => {
                  const actual = fieldTotals[field.id] ?? 0
                  const actualPct = totalActual > 0 ? (actual / totalActual) * 100 : 0
                  const met = actual >= field.minHours
                  return (
                    <tr key={field.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-2 text-center font-black text-sm">{field.id}</td>
                      <td className="border border-gray-300 px-3 py-2 text-[11px] leading-snug">{field.description}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-[11px] font-semibold">{field.percentage}%</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-[11px] font-semibold">{field.minHours.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-black text-[12px]">{actual.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">{actualPct.toFixed(1)}%</td>
                      <td className={`border border-gray-300 px-3 py-2 text-center text-[9px] font-black uppercase tracking-wider ${met ? "text-green-700" : "text-red-600"}`}>
                        {met ? "Met" : "Unmet"}
                      </td>
                    </tr>
                  )
                })}
                {/* Total row */}
                <tr className="bg-gray-200 font-black">
                  <td className="border border-gray-300 px-3 py-2 text-center font-black text-sm" colSpan={2}>TOTAL</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">100%</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">{goalHours.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-black text-[12px]">{totalActual.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">
                    {goalHours > 0 ? `${Math.min((totalActual / goalHours) * 100, 100).toFixed(1)}%` : "0%"}
                  </td>
                  <td className={`border border-gray-300 px-3 py-2 text-center text-[9px] font-black uppercase tracking-wider ${totalActual >= goalHours ? "text-green-700" : "text-red-600"}`}>
                    {totalActual >= goalHours ? "Complete" : "Incomplete"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature section */}
          <div className="grid grid-cols-2 gap-16 mt-10">
            <div className="space-y-1">
              <div className="border-b border-black pt-10" />
              <p className="text-[11px] font-bold text-center">{profile?.name ?? "___________________________"}</p>
              <p className="text-[10px] text-center text-gray-500">Trainee Signature over Printed Name</p>
              <p className="text-[10px] text-center text-gray-500">Date: ___________________</p>
            </div>
            <div className="space-y-1">
              <div className="border-b border-black pt-10" />
              <p className="text-[11px] font-bold text-center">{mentorInfo.deanName ?? "___________________________"}</p>
              <p className="text-[10px] text-center text-gray-500">Supervising Architect / Mentor</p>
              <p className="text-[10px] text-center text-gray-500">Date: ___________________</p>
            </div>
          </div>

          <p className="text-[9px] text-gray-400 text-center mt-8 border-t border-gray-200 pt-4">
            Generated by OJT Tracker on {generatedDate} · This document is for reference purposes. Please verify all information before official submission.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="font-semibold text-gray-500 w-36 flex-shrink-0">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}
