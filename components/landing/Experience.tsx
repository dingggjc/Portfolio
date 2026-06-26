"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"

interface ExperienceItem {
  period: string
  title: string
  description: string
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
      period: "8 Months",
      title: "Software Developer",
      description:
        "Developed frontend features for enterprise-level applications using React and Next.js, while managing backend logic and MySQL database structures via C#/.NET.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "2 Months",
      title: "Pre-Employment Training",
      description:
        "Underwent intensive training focused on real-world frontend workflows, developing responsive interfaces, and strengthening software troubleshooting skills.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "4 Months",
      title: "Frontend Developer (Internship)",
      description:
        "Built and optimized mobile UI components using React Native and Tailwind CSS. Reduced API complexity by implementing TanStack Query and Zod for data validation.",
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

        <div className="relative pl-6">
          {/* Vertical timeline line */}
          <div
            aria-hidden
            className="absolute left-0 top-2 bottom-4 w-px bg-border/60"
          />

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
                className="relative pb-10 last:pb-0"
              >
                {/* Timeline dot */}
                <div
                  aria-hidden
                  className="absolute -left-[25px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-primary/50 bg-background"
                >
                  <div className="h-1 w-1 rounded-full bg-primary/70" />
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
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
      </div>
    </section>
  )
}

export default Experience
