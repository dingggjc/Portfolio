"use client"

import { useGetSession } from "@/app/hooks/attendance/useGetSession"
import { useGetSettings } from "@/app/hooks/attendance/useGetSettings"
import { useUserProfile } from "@/app/hooks/useUserProfile"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PracticeField } from "@/lib/attendance-constants"
import { differenceInCalendarDays, format } from "date-fns"
import { PrinterIcon } from "lucide-react"
import { useMemo } from "react"
import { MentorInfoCard } from "./components/mentor-info-card"

interface Session {
  clockIn: string
  clockOut: string | null
  break: number
  splits?: Record<string, number> | null
}

export default function ReportPage() {
  const { data: sessions = [], isLoading: sessionsLoading } = useGetSession()
  const { data: settings, isLoading: settingsLoading } = useGetSettings()
  const { data: profile, isLoading: profileLoading } = useUserProfile()

  const isLoading = sessionsLoading || settingsLoading || profileLoading

  const practiceFields = useMemo(
    () => (settings?.practiceFields ?? []) as PracticeField[],
    [settings?.practiceFields]
  )
  const goalHours = settings?.goalHours ?? 0
  const initialBalance = settings?.initialBalance ?? 0
  const mentorInfo = settings?.mentorInfo ?? {}
  const targetDate = settings?.targetDate

  const { fieldTotals, totalActual, firstDate, lastDate } = useMemo(() => {
    const completed = (sessions as Session[]).filter((s) => s.clockOut)
    const totals: Record<string, number> = {}
    practiceFields.forEach((f) => {
      totals[f.id] = f.initialHours ?? 0
    })
    completed.forEach((s) => {
      if (!s.splits) return
      practiceFields.forEach((f) => {
        totals[f.id] += s.splits?.[f.id] || 0
      })
    })
    const totalActual =
      Object.values(totals).reduce((a, b) => a + b, 0) + initialBalance
    const sorted = [...completed].sort(
      (a, b) => new Date(a.clockIn).getTime() - new Date(b.clockIn).getTime()
    )
    const firstDate = sorted[0]
      ? format(new Date(sorted[0].clockIn), "MMMM d, yyyy")
      : "—"
    const lastDate = sorted.at(-1)
      ? format(new Date(sorted.at(-1)!.clockIn), "MMMM d, yyyy")
      : "—"
    return { fieldTotals: totals, totalActual, firstDate, lastDate }
  }, [sessions, practiceFields, initialBalance])

  const generatedDate = format(new Date(), "MMMM d, yyyy")

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">DT Form 001</h1>
          <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
            Diversified Training Record
          </p>
        </div>
        <Button
          onClick={() => window.print()}
          className="h-9 gap-2 rounded-lg bg-primary px-5 text-[11px] font-bold text-white"
        >
          <PrinterIcon size={14} /> Print / Save PDF
        </Button>
      </div>

      {/* Mentor info — editable, hidden on print */}
      <div className="print:hidden">
        <MentorInfoCard />
      </div>

      {/* Form preview */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-6 text-black shadow-md sm:p-10 print:rounded-none print:border-none print:p-0 print:shadow-none">
        {/* Header */}
        <div className="mb-6 border-b-2 border-black pb-4 text-center">
          <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
            Republic of the Philippines
          </p>
          <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
            Professional Regulation Commission
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight">
            DIVERSIFIED TRAINING RECORD
          </h2>
          <p className="mt-0.5 text-sm font-bold text-gray-600">DT Form 001</p>
          <p className="mt-1 text-[10px] text-gray-500">
            Required for application for registration as Registered Architect
            (RA) under R.A. No. 9266
          </p>
        </div>

        {/* Trainee & Training Info */}
        <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <h3 className="mb-2 text-[9px] font-black tracking-widest text-gray-400 uppercase">
              Trainee Information
            </h3>
            <InfoRow label="Name" value={profile?.name ?? "—"} />
            <InfoRow label="Email" value={profile?.email ?? "—"} />
            <InfoRow
              label="School / University"
              value={mentorInfo.school ?? "—"}
            />
            <InfoRow
              label="Date of Graduation"
              value={
                mentorInfo.dateOfGraduation
                  ? format(
                      new Date(mentorInfo.dateOfGraduation),
                      "MMMM d, yyyy"
                    )
                  : "—"
              }
            />
            <InfoRow
              label="School Control No."
              value={mentorInfo.schoolControlNo ?? "—"}
            />
            <InfoRow label="IAPOA No." value={mentorInfo.iapoanNo ?? "—"} />
            <InfoRow
              label="Date Issued"
              value={
                mentorInfo.dateIssued
                  ? format(new Date(mentorInfo.dateIssued), "MMMM d, yyyy")
                  : "—"
              }
            />
            <InfoRow
              label="Expiry Date"
              value={
                mentorInfo.expiryDate
                  ? format(new Date(mentorInfo.expiryDate), "MMMM d, yyyy")
                  : "—"
              }
            />
          </div>
          <div className="space-y-2">
            <h3 className="mb-2 text-[9px] font-black tracking-widest text-gray-400 uppercase">
              Training Period
            </h3>
            <InfoRow label="Date Started" value={firstDate} />
            <InfoRow label="Last Session" value={lastDate} />
            <InfoRow
              label="Target Completion"
              value={
                targetDate ? format(new Date(targetDate), "MMMM d, yyyy") : "—"
              }
            />
            <InfoRow
              label="Days Remaining"
              value={
                targetDate
                  ? `${Math.max(differenceInCalendarDays(new Date(targetDate), new Date()), 0)} days`
                  : "—"
              }
            />
            <InfoRow
              label="Goal Hours"
              value={
                goalHours > 0 ? `${goalHours.toLocaleString()} hours` : "—"
              }
            />
            <InfoRow
              label="Initial Balance"
              value={`${initialBalance.toFixed(1)} hours`}
            />
            <InfoRow
              label="Total Rendered"
              value={`${totalActual.toFixed(2)} hours`}
            />
            <InfoRow label="Report Generated" value={generatedDate} />
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="mb-8 space-y-2 text-sm">
          <h3 className="mb-2 text-[9px] font-black tracking-widest text-gray-400 uppercase">
            Supervising Architect / Mentor
          </h3>
          <InfoRow label="Name" value={mentorInfo.deanName ?? "—"} />
        </div>

        {/* Training Hours Table */}
        <div className="mb-8">
          <h3 className="mb-3 text-[9px] font-black tracking-widest text-gray-400 uppercase">
            Field Hours Distribution
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-10 border border-gray-300 px-3 py-2 text-left text-[10px] font-black tracking-wider uppercase">
                  Field
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-[10px] font-black tracking-wider uppercase">
                  Description of Architectural Practice
                </th>
                <th className="w-20 border border-gray-300 px-3 py-2 text-center text-[10px] font-black tracking-wider uppercase">
                  Req. %
                </th>
                <th className="w-24 border border-gray-300 px-3 py-2 text-center text-[10px] font-black tracking-wider uppercase">
                  Min. Hrs
                </th>
                <th className="w-24 border border-gray-300 px-3 py-2 text-center text-[10px] font-black tracking-wider uppercase">
                  Actual Hrs
                </th>
                <th className="w-20 border border-gray-300 px-3 py-2 text-center text-[10px] font-black tracking-wider uppercase">
                  Actual %
                </th>
                <th className="w-20 border border-gray-300 px-3 py-2 text-center text-[10px] font-black tracking-wider uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {practiceFields.map((field, i) => {
                const actual = fieldTotals[field.id] ?? 0
                const actualPct =
                  totalActual > 0 ? (actual / totalActual) * 100 : 0
                const met = actual >= field.minHours
                return (
                  <tr
                    key={field.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm font-black">
                      {field.id}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-[11px] leading-snug">
                      {field.description}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-[11px] font-semibold">
                      {field.percentage}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-[11px] font-semibold">
                      {field.minHours.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-[12px] font-black">
                      {actual.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">
                      {actualPct.toFixed(1)}%
                    </td>
                    <td
                      className={`border border-gray-300 px-3 py-2 text-center text-[9px] font-black tracking-wider uppercase ${met ? "text-green-700" : "text-red-600"}`}
                    >
                      {met ? "Met" : "Unmet"}
                    </td>
                  </tr>
                )
              })}
              <tr className="bg-gray-200 font-black">
                <td
                  className="border border-gray-300 px-3 py-2 text-center text-sm font-black"
                  colSpan={2}
                >
                  TOTAL
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">
                  100%
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">
                  {goalHours > 0 ? goalHours.toLocaleString() : "—"}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-[12px] font-black">
                  {totalActual.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-[11px]">
                  {goalHours > 0
                    ? `${Math.min((totalActual / goalHours) * 100, 100).toFixed(1)}%`
                    : "—"}
                </td>
                <td
                  className={`border border-gray-300 px-3 py-2 text-center text-[9px] font-black tracking-wider uppercase ${totalActual >= goalHours && goalHours > 0 ? "text-green-700" : "text-red-600"}`}
                >
                  {totalActual >= goalHours && goalHours > 0
                    ? "Complete"
                    : "Incomplete"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-10 grid grid-cols-2 gap-16">
          <div className="space-y-1">
            <div className="border-b border-black pt-10" />
            <p className="text-center text-[11px] font-bold">
              {profile?.name ?? "___________________________"}
            </p>
            <p className="text-center text-[10px] text-gray-500">
              Trainee Signature over Printed Name
            </p>
            <p className="text-center text-[10px] text-gray-500">
              Date: ___________________
            </p>
          </div>
          <div className="space-y-1">
            <div className="border-b border-black pt-10" />
            <p className="text-center text-[11px] font-bold">
              {mentorInfo.deanName ?? "___________________________"}
            </p>
            <p className="text-center text-[10px] text-gray-500">
              Supervising Architect / Mentor
            </p>
            <p className="text-center text-[10px] text-gray-500">
              Date: ___________________
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-gray-200 pt-4 text-center text-[9px] text-gray-400">
          Generated by OJT Tracker on {generatedDate} · This document is for
          reference purposes. Please verify all information before official
          submission.
        </p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="w-36 shrink-0 font-semibold text-gray-500">
        {label}:
      </span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}
