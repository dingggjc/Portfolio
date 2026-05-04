import ProfileContent from "@/components/profile/profile-content"
import ProfileHeader from "@/components/profile/profile-header"

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter">Profile</h1>
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase opacity-70">
          Account • Personal details
        </p>
      </div>
      <ProfileHeader />
      <ProfileContent />
    </div>
  )
}
