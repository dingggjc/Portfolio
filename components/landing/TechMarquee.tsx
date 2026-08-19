/* eslint-disable @next/next/no-img-element -- Brand SVGs are served directly by Simple Icons. */

import { Marquee } from "@/components/ui/marquee"
import { RadioTower } from "lucide-react"

type Technology = {
  name: string
  slug: string
  color: string
}

const technologies: Technology[] = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "000000" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "React Native", slug: "react", color: "61DAFB" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "C# / .NET", slug: "dotnet", color: "512BD4" },
  { name: "SignalR", slug: "signalr", color: "512BD4" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Laravel", slug: "laravel", color: "FF2D20" },
  { name: "MySQL", slug: "mysql", color: "4479A1" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Vite", slug: "vite", color: "646CFF" },
  { name: "Expo", slug: "expo", color: "000000" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Git", slug: "git", color: "F05032" },
]

function TechnologyLogo({ technology }: { technology: Technology }) {
  const isSignalR = technology.slug === "signalr"

  return (
    <div className="flex items-center gap-4 whitespace-nowrap px-7 py-4 text-muted-foreground transition-colors duration-200 hover:text-foreground">
      {isSignalR ? (
        <RadioTower
          aria-hidden="true"
          strokeWidth={1.75}
          className="h-8 w-8 shrink-0"
          style={{ color: `#${technology.color}` }}
        />
      ) : (
        <img
          src={`https://cdn.simpleicons.org/${technology.slug}/${technology.color}`}
          alt=""
          aria-hidden="true"
          width="32"
          height="32"
          className={`h-8 w-8 object-contain ${["nextdotjs", "expo"].includes(technology.slug) ? "dark:invert" : ""}`}
        />
      )}
      <span className="text-lg font-medium tracking-tight">{technology.name}</span>
    </div>
  )
}

export default function TechMarquee() {
  return (
    <div id="skills" aria-label="Core technologies" className="mx-auto w-full max-w-7xl pb-8">
      <div className="relative overflow-hidden border-y border-border/70 bg-muted/25 py-1.5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <Marquee pauseOnHover className="[--duration:55s] [--gap:0.25rem]">
          {technologies.map((technology) => (
            <TechnologyLogo key={technology.name} technology={technology} />
          ))}
        </Marquee>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />
      </div>
    </div>
  )
}
