"use client"

import { projects } from "@/data/project.data"
import { GlobeIcon } from "@radix-ui/react-icons"
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

import { motion } from "motion/react"

export function Projects() {
  return (
    <section
      id="projects"
      className="flex min-h-screen items-center justify-center px-4 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Featured Work
          </p>

          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Projects I&apos;ve Contributed To
          </h2>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Explore a selection of applications and platforms I&apos;ve helped
            build, showcasing my focus on delivering elegant and scalable user
            experiences.
          </p>
        </div>

        <BentoGrid className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <BentoCard key={feature.id} {...feature} />
          ))}
        </BentoGrid>
      </motion.div>
    </section>
  )
}
