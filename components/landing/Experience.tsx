"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import Image from "next/image"

interface ExperienceItem {
  period: string
  title: string
  description: string
  company: string
  logo: string
}

interface Experience1Props {
  heading?: string
  buttonText?: string
  buttonUrl?: string
  experience?: ExperienceItem[]
  className?: string
}

const Experience = ({
  heading = "Experience",
  experience = [
    {
      period: "6 Months",
      title: "Software Developer",
      description:
        "Developed frontend features for enterprise-level applications using React and Next.js, while managing backend logic and MySQL database structures via C#/.NET.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "2 Months",
      title: "Pre-Employment Training (Frontend)",
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
}: Experience1Props) => {
  return (
    <section
      id="experience"
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-20",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto w-full max-w-6xl space-y-10 lg:space-y-12"
      >
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Career
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight">{heading}</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            My professional journey in software development, highlighting key
            roles, technical milestones, and the projects I&apos;ve helped
            build.
          </p>
        </div>

        <div className="rounded-xl border border-border/40 bg-muted/50 p-8 shadow-sm md:p-10 lg:p-12">
          <ul>
            {experience.map((exp, index) => (
              <li
                key={index}
                className="flex flex-col justify-between border-b py-10 last:border-b-0 md:flex-row"
              >
                <div className="max-w-lg text-xl tracking-tighter lg:w-1/3">
                  {exp.period}
                </div>
                <div className="lg:w-1/3">
                  <h2 className="mb-4 text-2xl font-semibold tracking-tighter">
                    {exp.title}
                  </h2>
                  <p className="text-foreground/50">{exp.description}</p>
                </div>
                <div className="flex items-start justify-end gap-3 text-right lg:w-1/4">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={24}
                    height={24}
                    className="dark:invert"
                  />
                  {exp.company}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}

export default Experience
