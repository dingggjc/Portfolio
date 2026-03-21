import { useQuery } from "@tanstack/react-query"

export function useGetSettings() {
  return useQuery({
    queryKey: ["attendance-settings"],
    queryFn: async () => {
      const res = await fetch("/api/attendance-settings")
      return res.json()
    },
  })
}
