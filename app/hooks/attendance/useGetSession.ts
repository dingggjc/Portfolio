import { useQuery } from "@tanstack/react-query"

export function useGetSession() {
  return useQuery({
    queryKey: ["attendance-sessions"],
    queryFn: async () => {
      const res = await fetch("/api/attendance-sessions")
      const data = await res.json()
      return data || null
    },
    staleTime: 1000 * 60 * 5,
  })
}
