"use client"

import ContactMe from "@/components/landing/ContactMe"
import Experience from "@/components/landing/Experience"
import Hero from "@/components/landing/Hero"
import Skills from "@/components/landing/Skills"

import MainNavbar from "@/components/global/MainNavbar"
import { Meteors } from "@/components/ui/meteors"
import { Projects } from "../components/landing/Projects"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <MainNavbar />
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <Meteors number={60} />
      </div>
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
