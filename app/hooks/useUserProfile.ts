import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/services/supabase/client"

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      // Get user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        return {
          name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
          email: user.email || '',
          avatar: profile.avatar_url || '/avatars/default.jpg',
        }
      }

      // Fallback to auth user data if no profile
      return {
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: '/avatars/default.jpg',
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
