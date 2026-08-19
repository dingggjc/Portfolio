import ContactMe from "@/components/landing/ContactMe"
import Experience from "@/components/landing/Experience"
import Hero from "@/components/landing/Hero"
import MainNavbar from "@/components/global/MainNavbar"
import { Projects } from "../components/landing/Projects"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <Hero />
      <Projects />
      <Experience />
      <ContactMe />
    </div>
  )
}
