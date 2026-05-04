import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function usePutSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      goalHours: number
      initialBalance: number
      practiceFields?: object
      mentorInfo?: object
      targetDate?: string | null
      restDays?: number[]
    }) => {
      try {
        const res = await fetch("/api/attendance-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to save settings")
        }
        return res.json()
      } catch (error) {
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
          throw new Error("Something went wrong. Please try again.")
        }
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-settings"] })
      toast.success("Settings updated!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
