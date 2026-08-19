"use client"

import { projects } from "@/data/project.data"
import { GlobeIcon } from "@radix-ui/react-icons"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import { BentoCard } from "../ui/bento-grid"

const features = projects.map((project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  href: `/projects/${project.id}`,
  cta: project.cta,
  Icon: GlobeIcon,
  className: "min-h-[20rem] w-full",
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

const featuredProjects = features.slice(0, 4)
const additionalProjects = features.slice(4)
const leftColumnProjects = featuredProjects.filter(
  (_, index) => index % 2 === 0
)
const rightColumnProjects = featuredProjects.filter(
  (_, index) => index % 2 !== 0
)

export function Projects() {
  const reduce = useReducedMotion()

  return (
    <section
      id="projects"
      className="px-4 py-24 lg:flex lg:min-h-dvh lg:flex-col lg:py-12"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col lg:flex-1">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 w-full max-w-5xl text-center"
        >
          <h2 className="mb-3 text-4xl font-bold tracking-tight">
            Selected Work
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Applications and platforms I&apos;ve built, alone and with teams.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-6">
            {leftColumnProjects.map((feature) => (
              <BentoCard key={feature.id} {...feature} />
            ))}
          </div>

          <div className="flex flex-col gap-6 lg:pt-12">
            {rightColumnProjects.map((feature) => (
              <BentoCard key={feature.id} {...feature} />
            ))}
          </div>
        </div>

        {additionalProjects.length > 0 && (
          <div className="mt-8">
            {additionalProjects.map((feature) => (
              <BentoCard
                key={feature.id}
                {...feature}
                className="min-h-[24rem] w-full"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
