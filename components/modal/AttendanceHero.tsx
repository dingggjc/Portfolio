"use client"

import { useEffect, useState } from "react"
import { format, differenceInSeconds } from "date-fns"
import { Button } from "@/components/ui/button"
import { 
  ClockIcon, 
  PlayIcon, 
  StopCircleIcon,
  TrendingUpIcon,
  PauseIcon,
  HelpCircleIcon,
  InfoIcon,
  AlertCircleIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AttendanceHeroProps {
  isClockedIn: boolean
  isPaused: boolean
  onToggle: () => void
  onPause: () => void
  onResume: () => void
  startTime?: string
  totalPausedSeconds: number
  totalHours: string
  remainingHours: string
  todayHours: string
  totalDays: number
  progress: number
  targetHours: number
  isSubmitting: boolean
}

function Timer({ startTimeISO, totalPausedSeconds, isPaused }: { startTimeISO: string, totalPausedSeconds: number, isPaused: boolean }) {
  const [elapsed, setElapsed] = useState("00:00:00")

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      const start = new Date(startTimeISO)
      const now = new Date()
      const diffSeconds = differenceInSeconds(now, start) - totalPausedSeconds
      
      const hours = Math.floor(diffSeconds / 3600)
      const minutes = Math.floor((diffSeconds % 3600) / 60)
      const seconds = diffSeconds % 60
      
      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      )
    }, 1000)
    
    return () => clearInterval(timer)
  }, [startTimeISO, totalPausedSeconds, isPaused])

  return <span className={`font-mono tabular-nums font-black tracking-tighter ${isPaused ? "text-muted-foreground/40" : "text-primary transition-all duration-300"}`}>{elapsed}</span>
}

export function AttendanceHero({ 
  isClockedIn, 
  isPaused,
  onToggle, 
  onPause,
  onResume,
  startTime,
  totalPausedSeconds,
  totalHours, 
  remainingHours, 
  todayHours, 
  totalDays, 
  progress, 
  targetHours,
  isSubmitting
}: AttendanceHeroProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleFinalize = () => {
    onToggle()
    setConfirmOpen(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1 shadow-md border-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
            <ClockIcon size={18} className="text-primary" /> Time Tracking
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold opacity-70">Active work period control</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-2 pb-6 gap-6">
          <div className="flex flex-col items-center gap-2 w-full">
            {isClockedIn && startTime && (
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary italic mb-1">
                  <div className={`size-1.5 rounded-full ${isPaused ? "bg-muted-foreground" : "bg-primary animate-pulse"}`}></div>
                  {isPaused ? "On break" : "In progress"}
                </div>
                <div className="text-5xl font-black tracking-tighter mt-1">
                  <Timer startTimeISO={startTime} totalPausedSeconds={totalPausedSeconds} isPaused={isPaused} />
                </div>
              </div>
            )}
            
            {!isClockedIn && (
              <div className="flex flex-col items-center gap-2 text-center py-4">
                <div className="bg-muted size-10 rounded-full flex items-center justify-center">
                  <ClockIcon size={20} className="text-muted-foreground/50" />
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground/50">
                  Ready to start?
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2 w-full max-w-[220px] mt-2">
              {!isClockedIn ? (
                <Button 
                  size="default" 
                  onClick={onToggle}
                  disabled={isSubmitting}
                  className="h-12 w-full text-sm font-bold rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2" size={16} /> Start Work Period
                    </>
                  )}
                </Button>
              ) : (
                <>
                  {isPaused ? (
                    <Button 
                      size="default" 
                      onClick={onResume}
                      disabled={isSubmitting}
                      className="h-12 w-full text-sm font-bold rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Resuming...
                        </>
                      ) : (
                        <>
                          <PlayIcon className="mr-2" size={16} /> Resume Work
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      size="default" 
                      variant="outline"
                      onClick={onPause}
                      disabled={isSubmitting}
                      className="h-12 w-full text-sm font-bold rounded-xl border-dashed border-primary/30 hover:bg-primary/5"
                    >
                      <PauseIcon className="mr-2" size={14} /> Take a break
                    </Button>
                  )}
                  
                  <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-9 w-full text-[11px] font-bold text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors group"
                      >
                        <StopCircleIcon className="mr-2 opacity-50 group-hover:opacity-100" size={12} /> Finish & save work
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <div className="bg-destructive/10 size-12 rounded-full flex items-center justify-center mb-4">
                          <AlertCircleIcon size={24} className="text-destructive" />
                        </div>
                        <DialogTitle className="text-xl font-black tracking-tight text-foreground">Finalize work period?</DialogTitle>
                        <DialogDescription className="text-sm font-medium leading-relaxed pt-2">
                          Are you sure you want to clock out? This will calculate your net work duration (excluding any break time) and add it to your logs.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="bg-muted/50 rounded-xl p-4 space-y-3 my-2 border border-primary/5">
                        <div className="flex gap-3">
                          <InfoIcon size={14} className="text-primary shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold text-foreground">How it works</p>
                            <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                              Your total hours are calculated by taking the work period length and subtracting any "Break" time you logged.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <HelpCircleIcon size={14} className="text-primary shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold text-foreground">Next steps</p>
                            <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                              Once saved, this work period will appear in your "Recent Work" table and contribute to your 600h requirement.
                            </p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button 
                          variant="ghost" 
                          onClick={() => setConfirmOpen(false)}
                          className="text-xs font-bold"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleFinalize}
                          disabled={isSubmitting}
                          className="bg-destructive hover:bg-destructive/90 text-white text-xs font-bold rounded-lg px-6"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                              Finishing...
                            </>
                          ) : (
                            "Yes, finish work"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
          
          <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-tighter text-center">
            {isClockedIn && startTime ? `Session started at ${format(new Date(startTime), "p")}` : "Your sessions contribute to your OJT requirement."}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-md border-primary/10 bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
            <TrendingUpIcon size={18} className="text-primary" /> Training progress
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold opacity-70">OJT certification statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-[10px] font-bold text-muted-foreground/60">Total logged</span>
              <p className="text-3xl font-black tracking-tighter">{totalHours}<span className="text-sm font-medium ml-0.5">h</span></p>
            </div>
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-[10px] font-bold text-muted-foreground/60">Remaining</span>
              <p className="text-3xl font-black tracking-tighter">{remainingHours}<span className="text-sm font-medium ml-0.5">h</span></p>
            </div>
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-[10px] font-bold text-primary/80">Logged today</span>
              <p className="text-3xl font-black tracking-tighter text-primary">{todayHours}<span className="text-sm font-medium ml-0.5 text-primary/70">h</span></p>
            </div>
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-[10px] font-bold text-muted-foreground/60">Total days</span>
              <p className="text-3xl font-black tracking-tighter">{totalDays}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/80">
              <span>Certification progress</span>
              <span className="text-primary font-black">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-primary/5 shadow-inner">
              <div 
                className="h-full bg-primary transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold opacity-50">Target: {targetHours} hours required for OJT completion.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
