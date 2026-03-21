import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await fetch(`/api/attendance-sessions?id=${id}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to delete session")
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
      toast.success("Session deleted!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
