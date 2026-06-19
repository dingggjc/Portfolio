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
    <section
      id="experience"
      className={cn("px-4 py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-4xl font-bold tracking-tight"
        >
          Experience
        </motion.h2>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border/40 bg-muted/50 p-8 shadow-sm md:p-10 lg:p-12"
        >
          <ul className="divide-y divide-border/40">
            {experience.map((exp, index) => (
              <li
                key={index}
                className="flex flex-col justify-between py-10 first:pt-0 last:pb-0 md:flex-row"
              >
                <div className="mb-2 max-w-lg font-mono text-sm tracking-wide text-muted-foreground md:mb-0 lg:w-1/4">
                  {exp.period}
                </div>
                <div className="lg:w-5/12">
                  <h3 className="mb-3 text-xl font-semibold tracking-tight">
                    {exp.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                </div>
                <div className="mt-4 flex items-start gap-2 md:mt-0 md:justify-end lg:w-1/4">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={20}
                    height={20}
                    className="mt-0.5 rounded-sm dark:invert"
                  />
                  <span className="text-sm text-muted-foreground">
                    {exp.company}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience
