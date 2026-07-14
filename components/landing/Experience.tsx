"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"

interface ExperienceItem {
  period: string
  title: string
  bullets: string[]
  company: string
  logo: string
}

interface ExperienceProps {
  experience?: ExperienceItem[]
  className?: string
}

const Experience = ({
  experience = [
    {
      period: "2025 – Present",
      title: "Full Stack Developer",
      bullets: [
        "Shipped features across four production applications spanning web and mobile: Helps Innovation (React/C#), Careerpoint (Next.js/C#), Neuropoint (React/C#), and Helps Emergency (React Native, published on Google Play).",
        "Built frontend features in React and Next.js and backend logic in C# (.NET) following Clean Architecture and CQRS patterns.",
        "Designed and maintained MySQL database schemas and queries supporting core application workflows.",
        "Debugged cross-team production issues, including Axios interceptor error propagation and React Query cache invalidation bugs, improving application reliability.",
      ],
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "6 Months, 2025",
      title: "Full Stack Developer — Pre-Employment Training & Internship",
      bullets: [
        "Completed an intensive pre-employment training program simulating agile production workflows, building pixel-perfect UIs from Figma mockups.",
        "Built and maintained modular UI components in React, React Native, Tailwind CSS, and Next.js during a 4-month frontend internship.",
        "Implemented async state management with TanStack Query and type-safe form validation with Zod.",
      ],
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
  ],
  className,
}: ExperienceProps) => {
  const reduce = useReducedMotion()

  return (
    <section id="experience" className={cn("px-4 py-24", className)}>
      <div className="mx-auto w-full max-w-5xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-4xl font-bold tracking-tight"
        >
          Experience
        </motion.h2>

        <ul className="space-y-0">
          {experience.map((exp, index) => (
            <motion.li
              key={index}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex gap-4 pb-10 last:pb-0"
            >
              {/* Timeline marker */}
              <div className="flex shrink-0 flex-col items-center">
                <div className="mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-background">
                  <div className="h-1 w-1 rounded-full bg-primary/70" />
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {/* Period */}
                <div className="shrink-0 md:w-[120px]">
                  <span className="font-mono text-xs tracking-wide text-muted-foreground">
                    {exp.period}
                  </span>
                </div>

                {/* Role + description */}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold tracking-tight">
                    {exp.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="flex shrink-0 items-center gap-2 md:w-[140px] md:justify-end">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={16}
                    height={16}
                    className="rounded-sm dark:invert"
                  />
                  <span className="text-xs text-muted-foreground">
                    {exp.company}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Experience
