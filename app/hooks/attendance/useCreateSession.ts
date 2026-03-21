import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { 
      clockIn?: string
      clockOut?: string
      break?: number
      status?: string
    }) => {
      try {
        const res = await fetch("/api/attendance-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to create session")
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
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] })
      toast.success("Session created!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
