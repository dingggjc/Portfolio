import ContactMe from "@/components/landing/ContactMe"
import Experience from "@/components/landing/Experience"
import Hero from "@/components/landing/Hero"
import Skills from "@/components/landing/Skills"
import MainNavbar from "@/components/global/MainNavbar"
import { Projects } from "../components/landing/Projects"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <ContactMe />
    </div>
  )
}
