"use client"

import { projects } from "@/data/project.data"
import { GlobeIcon } from "@radix-ui/react-icons"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import { BentoCard, BentoGrid } from "../ui/bento-grid"

const features = projects.map((project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  href: `/projects/${project.id}`,
  cta: project.cta,
  links: [
    {
      href: project.websiteLink,
      icon: <GlobeIcon className="h-6 w-6" />,
    },
  ],
  background: (
    <Image
      src={project.image}
      alt={project.name}
      unoptimized
      fill
      className="absolute inset-0 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] object-cover object-top opacity-80 transition-all duration-300 ease-out group-hover:scale-105"
    />
  ),
}))

export function Projects() {
  const reduce = useReducedMotion()

  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="mb-3 text-4xl font-bold tracking-tight">
            Selected Work
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            Applications and platforms I've helped build.
          </p>
        </motion.div>

        <BentoGrid className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <BentoCard key={feature.id} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
