"use client"

import Hero from "@/components/landing/Hero"
import Skills from "@/components/landing/Skills"
import { Particles } from "@/components/ui/particles"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        refresh
        color="var(--primary)"
      />

      <div className="relative z-10">
        <Hero />
        <Skills />
      </div>
    </div>
  )
}
