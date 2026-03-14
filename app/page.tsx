"use client"

import ContactMe from "@/components/landing/ContactMe"
import Experience from "@/components/landing/Experience"
import Hero from "@/components/landing/Hero"
import Skills from "@/components/landing/Skills"
import { Particles } from "@/components/ui/particles"
import { useTheme } from "next-themes"
import { Projects } from "../components/landing/Projects"

export default function LandingPage() {
  const { resolvedTheme } = useTheme()

  const color = resolvedTheme === "dark" ? "#ffffff" : "#000000"

  return (
    <div className="relative min-h-screen">
      <Particles
        key={resolvedTheme}
        className="absolute inset-0 z-0"
        quantity={400}
        ease={80}
        color={color}
      />
      <div className="relative z-10">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <ContactMe />
      </div>
    </div>
  )
}
