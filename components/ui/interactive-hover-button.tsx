import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode
  showIcons?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

export function InteractiveHoverButton({
  children,
  className,
  icon = <ArrowRight />,
  rounded = "full",
  showIcons = true,
  ...props
}: Props) {
  const radiusClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded]
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden border bg-background p-2 px-6 text-center font-semibold",
        radiusClass,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        {showIcons && <div> {icon}</div>}
      </div>
    </button>
  )
}
