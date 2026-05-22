import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProgressSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
      {/* Page title */}
      <div className="space-y-1">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-3 w-44" />
      </div>

      {/* OJT Requirements card */}
      <Card className="overflow-hidden border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5 bg-muted/5 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-36 rounded-lg" />
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-primary/5 pt-2">
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Fields of Practice section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4">
              <Skeleton className="size-8 rounded-full flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2.5 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
