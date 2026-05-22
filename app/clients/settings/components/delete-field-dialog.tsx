"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { useSettings } from "./settings-context"

export function DeleteFieldDialog() {
  const { fieldToDelete, setFieldToDelete, confirmRemoveField } = useSettings()

  return (
    <AlertDialog
      open={!!fieldToDelete}
      onOpenChange={(open) => { if (!open) setFieldToDelete(null) }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black tracking-tight">
            Remove Field {fieldToDelete?.id}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[12px] leading-relaxed">
            This will remove <strong>Field {fieldToDelete?.id}</strong>
            {fieldToDelete?.description ? ` — ${fieldToDelete.description.split(",")[0]}` : ""}.
            Any logged hours split to this field will no longer appear in progress charts.
            This action cannot be undone without resetting to defaults.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-[11px] font-bold">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmRemoveField}
            className="bg-destructive text-white hover:bg-destructive/90 text-[11px] font-bold"
          >
            <Trash2Icon size={13} className="mr-1.5" /> Remove field
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
