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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-l-2 border-primary/30 pl-5"
            >
              <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-sm text-muted-foreground">
                    {skill}
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
