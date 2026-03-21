import { createClient } from "@/services/supabase/server"

export async function getUserId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id
}
