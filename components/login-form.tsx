"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/services/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const redirectTo = searchParams.get("redirect") || "/clients/dashboard"

  async function handleEmailLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignUp(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        alert("Check your email to confirm your account!")
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isLogin) {
      await handleEmailLogin(e)
    } else {
      await handleSignUp(e)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Create an account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your email below to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {isLogin && (
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </Field>
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Loading..." : isLogin ? "Login" : "Sign up"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  {isLogin ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="underline underline-offset-4 hover:no-underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="underline underline-offset-4 hover:no-underline"
                      >
                        Login
                      </button>
                    </>
                  )}
                </FieldDescription>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
