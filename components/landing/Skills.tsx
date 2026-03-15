"use client"

import { Badge } from "../ui/badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

const skillCategories = [
  {
    title: "Frontend",
    description: "Building responsive, interactive user interfaces",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "Backend",
    description: "Server-side development and API design",
    skills: ["C#/.NET", "MySQL", "PHP (Laravel)", "Node.js"],
  },

  {
    title: "Tools & Other",
    description: "Workflow, design, and technical maintenance",
    skills: ["Git", "Figma", "TanStack Query", "Zod"],
  },
]

import { motion } from "motion/react"

export default function Skills() {
  return (
    <section
      id="skills"
      className="flex min-h-screen items-center justify-center px-4 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Skills
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Technologies I&apos;ve worked with
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Here are the technologies and tools I use to bring ideas to life —
            from pixel-perfect UIs to reliable backends.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {skillCategories.map((category) => (
            <Card
              key={category.title}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
