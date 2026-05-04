"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SaveIcon, UserIcon } from "lucide-react"
import { useUserProfile } from "@/app/hooks/useUserProfile"
import { useUpdateProfile } from "@/app/hooks/useUpdateProfile"
import { toast } from "sonner"

export default function ProfileContent() {
  const { data: userProfile, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    if (userProfile) {
      const parts = userProfile.name.split(" ")
      setFirstName(parts[0] || "")
      setLastName(parts.slice(1).join(" ") || "")
    }
  }, [userProfile])

  function handleSave() {
    if (!firstName.trim()) {
      toast.error("First name is required.")
      return
    }
    updateProfile.mutate(
      { first_name: firstName.trim(), last_name: lastName.trim() },
      { onSuccess: () => toast.success("Profile saved!") }
    )
  }

  if (isLoading) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardContent className="space-y-4 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-muted/50" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!userProfile) return null

  return (
    <Card className="border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="border-b border-primary/5 bg-muted/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <UserIcon size={18} className="text-primary" /> Personal Information
        </CardTitle>
        <CardDescription className="text-[11px] font-medium italic opacity-70">
          Update your name as it appears across the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-muted-foreground/80">
              <Label htmlFor="first_name">First Name</Label>
            </div>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-muted-foreground/80">
              <Label htmlFor="last_name">Last Name</Label>
            </div>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="dela Cruz"
              className="h-10 rounded-lg border-primary/10 text-sm font-medium focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-bold text-muted-foreground/80">
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            id="email"
            type="email"
            value={userProfile.email}
            disabled
            className="h-10 rounded-lg border-primary/10 text-sm font-medium bg-muted/30 cursor-not-allowed"
          />
          <p className="text-[10px] text-muted-foreground/50 font-medium">
            Email is managed by your login provider and cannot be changed here.
          </p>
        </div>

        <div className="flex justify-end border-t border-primary/5 pt-3">
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="h-9 gap-2 rounded-lg bg-primary px-6 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <SaveIcon size={14} />
            {updateProfile.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
