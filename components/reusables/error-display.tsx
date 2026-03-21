import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "lucide-react"

interface ErrorDisplayProps {
  title?: string
  description?: string

  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal"

  onRetry?: () => void
}

export function ErrorDisplay({
  title = "An error occurred",
  description = "Something went wrong. Please try again.",

  onRetry,

  size = "lg",
  variant = "default",
}: ErrorDisplayProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
  }

  const variantClasses = {
    default:
      "rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950",
    minimal:
      "border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950",
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-4 p-6 text-center">
      <div className={`w-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircleIcon className="h-6 w-6 stroke-current text-red-600 dark:text-red-200" />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
          {title}
        </h3>

        <p className="mb-6 text-red-700 dark:text-red-300">{description}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button className="mt-4" variant="destructive" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
