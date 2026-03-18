"use client"

import { useEffect, useState } from "react"
import { format, differenceInMinutes, differenceInSeconds } from "date-fns"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryIcon } from "lucide-react"

interface AttendanceEntry {
  id: string
  clock_in: string
  clock_out: string | null
  date: string
}

interface AttendanceHistoryProps {
  entries: AttendanceEntry[]
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

export function AttendanceHistory({ entries }: AttendanceHistoryProps) {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id} className="hover:bg-muted/30">
                <TableCell className="font-bold pl-8">{format(new Date(e.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="text-muted-foreground font-medium">{format(new Date(e.clock_in), "p")}</TableCell>
                <TableCell className="text-muted-foreground font-medium">
                  {e.clock_out ? format(new Date(e.clock_out), "p") : <RunningTimer startTimeISO={e.clock_in} />}
                </TableCell>
                <TableCell className="text-right font-black tabular-nums">
                  {e.clock_out ? (
                    `${Math.floor(differenceInMinutes(new Date(e.clock_out), new Date(e.clock_in))/60)}h ${differenceInMinutes(new Date(e.clock_out), new Date(e.clock_in))%60}m`
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 italic">Ongoing...</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <Badge variant={e.clock_out ? "secondary" : "default"} className="font-black text-[9px] px-2 h-5 rounded-md uppercase tracking-wider">
                    {e.clock_out ? "Logged" : "Active"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic text-xs">
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
