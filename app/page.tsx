"use client"

import Hero from "@/components/landing/Hero"
import Skills from "@/components/landing/Skills"
import { Particles } from "@/components/ui/particles"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { resolvedTheme } = useTheme()

  const color = resolvedTheme === "dark" ? "#ffffff" : "#000000"

  return (
    <div className="relative min-h-screen">
      <Particles
        key={resolvedTheme}
        className="absolute inset-0 z-0"
        quantity={300}
        ease={80}
        color={color}
      />
      <div className="relative z-10">
        <Hero />
        <Skills />
      </div>
    </div>
  )
}
