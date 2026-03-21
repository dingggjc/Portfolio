import { useQuery } from "@tanstack/react-query"

export function useGetUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed to fetch profile")
      return res.json()
    },
  })
}
