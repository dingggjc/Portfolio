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

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
          lastUpdated: new Date().toISOString()
        })
        .eq('id', user.id)

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
