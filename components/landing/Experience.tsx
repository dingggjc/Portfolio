"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import { HexagonPattern } from "../ui/hexagon-pattern"

interface ExperienceItem {
  period: string
  title: string
  summary: string
  bullets: string[]
}

interface ExperienceProps {
  experience?: ExperienceItem[]
  className?: string
}

const defaultExperience: ExperienceItem[] = [
  {
    period: "2025 - 2026",
    title: "Full Stack Developer",
    summary:
      "Contributed to production web and mobile applications as part of a small cross-functional team.",
    bullets: [
      "Built and maintained frontend features across four production applications: NeuroPoint LMS, IC Career Center, HELPS web, and HELPS Mobile.",
      "Developed role-based student, admin, employer, vendor, rider, and customer workflows using React, Next.js, React Native, and TypeScript.",
      "Integrated REST APIs, React Query, Redux, protected routes, forms, and reusable components for complex business workflows.",
      "Resolved an iCore payment gateway race condition that caused order and payment state mismatches.",
    ],
  },
]

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const Experience = ({
  experience = defaultExperience,
  className,
}: ExperienceProps) => {
  const reduce = useReducedMotion()

  return (
    <section
      id="experience"
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 isolate overflow-hidden bg-secondary/35 px-4 py-24 sm:py-32 dark:bg-muted/80",
        className
      )}
    >
      <HexagonPattern
        radius={36}
        gap={4}
        className="z-0 mask-[radial-gradient(460px_circle_at_center,black,transparent)] stroke-foreground/10"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 font-mono text-xs font-medium tracking-[0.16em] text-primary uppercase">
            Experience
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Building dependable products with teams that ship.
          </h2>
        </motion.div>

        <div className="grid gap-10 border-t border-border pt-8 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.7fr)] lg:gap-16">
          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease }}
            className="rounded-xl border border-border/80 bg-card/70 p-5 shadow-sm backdrop-blur-sm lg:sticky lg:top-24 lg:self-start"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/assets/jpeg/RepointLogo.jpg"
                alt="Repoint Solutions"
                width={36}
                height={36}
                className="rounded-lg dark:invert"
              />
                <p className="font-medium tracking-tight">
                  Repoint Solutions Inc.
                </p>
            </div>
            <dl className="mt-6 space-y-3 font-mono text-xs leading-relaxed text-muted-foreground">
              <div>
                <dt className="sr-only">Period</dt>
                <dd>2025 - 2026</dd>
              </div>
              <div>
                <dt className="sr-only">Location</dt>
                <dd>Cagayan de Oro, Philippines</dd>
              </div>
              <div>
                <dt className="sr-only">Team type</dt>
                <dd>Cross-functional product team</dd>
              </div>
            </dl>
          </motion.aside>

          <div>
            {experience.map((role, index) => (
              <motion.article
                key={`${role.title}-${role.period}`}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease }}
                className={cn(
                  index > 0 && "mt-10 border-t border-border pt-10"
                )}
              >
                <div className="border-l-2 border-primary/70 pl-5 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {role.title}
                  </h3>
                  <p className="mt-2 shrink-0 font-mono text-xs font-medium tracking-wide text-primary sm:mt-0">
                    {role.period}
                  </p>
                </div>
                <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {role.summary}
                </p>
                <p className="mt-8 font-mono text-xs font-medium tracking-[0.14em] text-primary uppercase">
                  Selected contributions
                </p>
                <ul className="mt-4 space-y-4 border-l border-border pl-5">
                  {role.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-baseline gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="font-mono text-xs font-medium leading-relaxed text-primary"
                      >
                        {String(bulletIndex + 1).padStart(2, "0")}
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
