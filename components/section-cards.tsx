"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ClockIcon, TargetIcon, HistoryIcon, PercentIcon, TrendingUpIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Hours Rendered</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            245.5<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px]">
              <ClockIcon size={12} className="mr-1" /> ACTIVE
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px] text-primary">
            +8.5h logged today <TrendingUpIcon className="size-3" />
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Total validated training hours
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">OJT Goal</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl text-primary">
            600<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-[10px]">
              <TargetIcon size={12} className="mr-1" /> TARGET
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px]">
            OJT Training Requirement
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Required curriculum hours
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Remaining Balance</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            354.5<span className="ml-1 text-sm font-medium text-muted-foreground">h</span>
          </CardTitle>
          <CardAction>
            <HistoryIcon size={14} className="text-muted-foreground/50" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px] text-primary">
            On track for completion
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Hours left to finish OJT
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Completion Progress</CardDescription>
          <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
            40.9<span className="ml-1 text-sm font-medium text-muted-foreground">%</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px]">
              <PercentIcon size={12} className="mr-1" /> PROGRESS
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-bold text-[11px] text-primary">
            Surpassing daily average
          </div>
          <div className="text-[10px] font-medium text-muted-foreground italic">
            Overall training percentage
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
