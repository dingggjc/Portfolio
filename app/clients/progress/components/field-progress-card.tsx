import { Input } from "@/components/ui/input"
import { PracticeField } from "@/lib/attendance-constants"
import { CheckCircle2Icon, Trash2Icon } from "lucide-react"

interface FieldProgressCardProps {
  field: PracticeField
  actualHours: number
  isEditing?: boolean
  onUpdate?: (key: keyof PracticeField, value: string | number) => void
  onDelete?: () => void
}

export function FieldProgressCard({
  field,
  actualHours,
  isEditing,
  onUpdate,
  onDelete,
}: FieldProgressCardProps) {
  const pct =
    field.minHours > 0 ? Math.min((actualHours / field.minHours) * 100, 100) : 0
  const remaining = Math.max(field.minHours - actualHours, 0)
  const met = actualHours >= field.minHours

  if (isEditing) {
    return (
      <div className="flex items-start gap-3 px-4 py-4">
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <span className="text-sm font-black text-primary">{field.id}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={field.description}
            onChange={(e) => onUpdate?.("description", e.target.value)}
            className="h-8 border-primary/15 bg-muted/20 text-sm font-medium focus-visible:ring-primary/30"
            placeholder="Field description"
          />
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Min hours</p>
              <Input
                type="number"
                min="0"
                value={field.minHours || ""}
                onChange={(e) =>
                  onUpdate?.("minHours", parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="h-8 border-primary/15 bg-muted/20 text-sm font-bold focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Initial hours</p>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={(field.initialHours ?? 0) || ""}
                onChange={(e) =>
                  onUpdate?.("initialHours", parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="h-8 border-primary/15 bg-muted/20 text-sm font-bold focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 py-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <span className="text-sm font-black text-primary">{field.id}</span>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 text-sm leading-snug font-semibold">
            {field.description}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {met && (
              <div className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-green-600 uppercase">
                <CheckCircle2Icon size={10} /> Met
              </div>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex size-6 items-center justify-center rounded-lg text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2Icon size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${met ? "bg-green-500" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex justify-between text-xs">
          <span className="font-semibold text-primary">
            {actualHours.toFixed(1)}h logged
          </span>
          <span className="text-muted-foreground">
            {met
              ? "Complete"
              : `${remaining.toFixed(1)}h to go · ${field.minHours.toLocaleString()}h required`}
          </span>
        </div>
      </div>
    </div>
  )
}
