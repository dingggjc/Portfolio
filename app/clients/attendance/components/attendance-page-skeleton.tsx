export function AttendancePageSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-muted/50"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-muted"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border-primary/10 shadow-md lg:col-span-1">
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-muted/50"></div>
            </div>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-20 w-20 animate-pulse rounded-full bg-muted"></div>
              <div className="h-12 w-48 animate-pulse rounded bg-muted"></div>
              <div className="h-12 w-full max-w-[220px] animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-primary/10 bg-muted/20 shadow-md lg:col-span-2">
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-40 animate-pulse rounded bg-muted/50"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                  <div className="h-3 w-20 animate-pulse rounded bg-muted/50"></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-2 w-full animate-pulse rounded bg-muted"></div>
              <div className="h-3 w-48 animate-pulse rounded bg-muted/50"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border-primary/10 shadow-md">
        <div className="space-y-4 border-b border-primary/5 bg-muted/10 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-48 animate-pulse rounded bg-muted/50"></div>
        </div>
        <div className="space-y-3 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-muted/20 py-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
              <div className="h-8 w-8 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
