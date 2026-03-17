"use client"

import MainNavbar from "@/components/global/MainNavbar"
import { LoginForm } from "@/components/login-form"
import { Meteors } from "@/components/ui/meteors"

export default function LoginPage() {
  return (
    <>
      <MainNavbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="pointer-events-none fixed inset-0 z-[-1]">
          <Meteors number={80} />
        </div>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
