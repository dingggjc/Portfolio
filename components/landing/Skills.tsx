"use client"

import { motion, useReducedMotion } from "motion/react"

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "Tailwind CSS",
      "HTML / CSS",
    ],
  },
  {
    title: "Backend",
    skills: ["C#/.NET", "MySQL", "PHP / Laravel", "Node.js"],
  },
  {
    title: "Tools",
    skills: ["Git", "Figma", "TanStack Query", "Zod"],
  },
]

export default function Skills() {
  const reduce = useReducedMotion()

  return (
    <section id="skills" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-4xl font-bold tracking-tight"
        >
          What I build with
        </motion.h2>

        <div className="space-y-5">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8"
            >
              <div className="w-20 shrink-0 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  {category.title}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <span className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/30 hover:bg-muted/60">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
