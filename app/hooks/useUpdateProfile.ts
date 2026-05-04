import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/services/supabase/client"

interface UpdateProfileData {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }

      const payload: Record<string, string | undefined> = {
        id: user.id,
        first_name: data.first_name ?? user.email?.split("@")[0] ?? "User",
        last_name: data.last_name,
        avatar_url: data.avatar_url,
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
  })
}
