"use client"

import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Mail, Calendar } from "lucide-react"
import { useUserProfile } from "@/app/hooks/useUserProfile"
import { useUpdateProfile } from "@/app/hooks/useUpdateProfile"
import { createClient } from "@/services/supabase/client"
import { format } from "date-fns"
import { toast } from "sonner"

export default function ProfileHeader() {
  const { data: userProfile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const ext = file.name.split(".").pop()
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path)

      await updateProfile.mutateAsync({ avatar_url: publicUrl })
      toast.success("Avatar updated!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload avatar")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  if (isLoading) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-36 animate-pulse rounded bg-muted" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userProfile) return null

  const initials = userProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="border-primary/10 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-20 w-20 ring-2 ring-primary/10">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-xl font-black bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              title="Change avatar"
            >
              {uploading ? (
                <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
              ) : (
                <Camera size={13} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">
                {userProfile.name}
              </h1>
              <Badge
                variant="secondary"
                className="text-[10px] font-bold tracking-wide"
              >
                OJT Trainee
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail size={12} />
                {userProfile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                Joined {format(new Date(), "MMMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
