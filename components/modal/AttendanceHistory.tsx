"use client"

import { useEffect, useState } from "react"
import { format, differenceInMinutes, differenceInSeconds } from "date-fns"
import { Trash2Icon } from "lucide-react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryIcon } from "lucide-react"

interface AttendanceEntry {
  id: string
  clockIn: string
  clockOut: string | null
  data: string
  break: number
  status: string
}

interface AttendanceHistoryProps {
  entries: AttendanceEntry[]
  onDelete?: (id: string) => void
}

function RunningTimer({ startTimeISO }: { startTimeISO: string }) {
  const [elapsed, setElapsed] = useState("00:00:00")

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startTimeISO)
      const now = new Date()
      const diffSeconds = differenceInSeconds(now, start)
      
      const hours = Math.floor(diffSeconds / 3600)
      const minutes = Math.floor((diffSeconds % 3600) / 60)
      const seconds = diffSeconds % 60
      
      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }, 1000)
    
    return () => clearInterval(timer)
  }, [startTimeISO])

  return <span className="font-mono font-bold text-primary">{elapsed}</span>
}

export function AttendanceHistory({ entries, onDelete }: AttendanceHistoryProps) {
  return (
    <Card className="shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="pb-0 bg-muted/10 border-b border-primary/5">
        <CardTitle className="text-lg flex items-center gap-2 font-bold pb-2">
          <HistoryIcon size={18} className="text-primary" /> Recent Sessions
        </CardTitle>
        <CardDescription className="pb-4">A complete log of your tracked working hours.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px] pl-8 text-[11px] font-bold uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider">Clock In</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider">Clock Out</TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider">Total Duration</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-bold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id} className="hover:bg-muted/30">
                <TableCell className="font-bold pl-8">{format(new Date(e.data), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-muted-foreground font-medium">{format(new Date(e.clockIn), "p")}</TableCell>
                <TableCell className="text-muted-foreground font-medium">
                  {e.clockOut ? format(new Date(e.clockOut), "p") : <RunningTimer startTimeISO={e.clockIn} />}
                </TableCell>
                <TableCell className="text-right font-black tabular-nums">
                  {e.clockOut ? (
                    `${Math.floor(differenceInMinutes(new Date(e.clockOut), new Date(e.clockIn))/60)}h ${differenceInMinutes(new Date(e.clockOut), new Date(e.clockIn))%60}m`
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 italic">Ongoing...</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <Badge variant={e.status === "completed" ? "secondary" : e.status === "paused" ? "outline" : "default"} className="font-black text-[9px] px-2 h-5 rounded-md uppercase tracking-wider">
                    {e.status === "completed" ? "Logged" : e.status === "paused" ? "Paused" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(e.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2Icon size={14} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-xs">
                  No session logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
