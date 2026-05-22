import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8 px-4 lg:px-6 py-4 md:py-6">
      <Skeleton className="h-9 w-48" />
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-primary/10">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
