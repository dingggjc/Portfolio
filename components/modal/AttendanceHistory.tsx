"use client"

import { useEffect, useRef, useState } from "react"
import { format, differenceInMinutes, differenceInSeconds } from "date-fns"
import { Trash2Icon, NotebookPenIcon, CheckIcon } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryIcon } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/modal/DeleteConfirmDialog"
import { useUpdateSession } from "@/app/hooks/attendance/useUpdateSession"

interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
  notes?: string | null
}

interface AttendanceHistoryProps {
  entries: AttendanceEntry[]
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

function RunningTimer({ startTimeISO }: { startTimeISO: string }) {
  const [elapsed, setElapsed] = useState("00:00:00")
  useEffect(() => {
    const timer = setInterval(() => {
      const diffSeconds = differenceInSeconds(new Date(), new Date(startTimeISO))
      const h = Math.floor(diffSeconds / 3600)
      const m = Math.floor((diffSeconds % 3600) / 60)
      const s = diffSeconds % 60
      setElapsed(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [startTimeISO])
  return <span className="font-mono font-bold text-primary">{elapsed}</span>
}

function NotesPopover({ entry }: { entry: AttendanceEntry }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(entry.notes ?? "")
  const updateSession = useUpdateSession()

  function handleSave() {
    updateSession.mutate(
      { id: entry.id, notes: draft.trim() || null },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${entry.notes ? "text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"}`}
          title={entry.notes ?? "Add note"}
        >
          <NotebookPenIcon size={13} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 space-y-2" align="end">
        <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider">Session note</p>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What did you work on?"
          rows={3}
          className="text-[12px] font-medium border-primary/10 focus-visible:ring-primary resize-none rounded-lg"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateSession.isPending}
          className="w-full h-8 text-[11px] font-bold gap-1.5"
        >
          {updateSession.isPending ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
          ) : (
            <CheckIcon size={12} />
          )}
          Save note
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export function AttendanceHistory({ entries, onDelete, isDeleting = false }: AttendanceHistoryProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const prevIsDeleting = useRef(isDeleting)

  useEffect(() => {
    if (prevIsDeleting.current && !isDeleting) {
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
    prevIsDeleting.current = isDeleting
  }, [isDeleting])

  const handleDeleteClick = (id: string) => { setEntryToDelete(id); setDeleteDialogOpen(true) }
  const handleConfirmDelete = () => { if (entryToDelete && onDelete) onDelete(entryToDelete) }
  const handleCancelDelete = () => { if (!isDeleting) { setDeleteDialogOpen(false); setEntryToDelete(null) } }
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) { setDeleteDialogOpen(false); setEntryToDelete(null) }
    else setDeleteDialogOpen(open)
  }

  return (
    <Card className="shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-0 bg-muted/10 border-b border-primary/5">
        <CardTitle className="text-lg flex items-center gap-2 font-bold pb-2">
          <HistoryIcon size={18} className="text-primary" /> Recent Work
        </CardTitle>
        <CardDescription className="pb-4">A complete log of your tracked working hours.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[160px] pl-8 text-[11px] font-bold uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider">Clock In</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider">Clock Out</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider">Duration</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-bold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => {
              const mins = e.clockOut
                ? differenceInMinutes(new Date(e.clockOut), new Date(e.clockIn)) - Math.floor((e.break || 0) / 60)
                : 0
              return (
                <TableRow key={e.id} className="hover:bg-muted/30">
                  <TableCell className="pl-8">
                    <div>
                      <p className="font-bold text-[12px]">{format(new Date(e.data), "MMM dd, yyyy")}</p>
                      {e.notes && (
                        <p className="text-[10px] text-muted-foreground/60 font-medium truncate max-w-[140px]">
                          {e.notes}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-[12px]">
                    {format(new Date(e.clockIn), "p")}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-[12px]">
                    {e.clockOut ? format(new Date(e.clockOut), "p") : <RunningTimer startTimeISO={e.clockIn} />}
                  </TableCell>
                  <TableCell className="text-right font-black tabular-nums text-[12px]">
                    {e.clockOut
                      ? `${Math.floor(mins / 60)}h ${mins % 60}m`
                      : <span className="text-[10px] text-muted-foreground/50 italic">Ongoing...</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={e.status === "completed" ? "secondary" : e.status === "paused" ? "outline" : "default"}
                      className="font-black text-[9px] px-2 h-5 rounded-md uppercase tracking-wider"
                    >
                      {e.status === "completed" ? "Logged" : e.status === "paused" ? "Paused" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-0.5">
                      <NotesPopover entry={e} />
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(e.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2Icon size={13} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-xs">
                  No work logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </Card>
  )
}
