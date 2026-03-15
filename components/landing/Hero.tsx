"use client"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { animate, motion } from "motion/react"
import { Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { InteractiveHoverButton } from "../ui/interactive-hover-button"

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center px-4 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl text-center"
      >
        <div className="px-auto py-auto mb-4 flex justify-center">
          <Avatar className="size-20">
            <AvatarImage
              alt="@myusername"
              src="/assets/jpeg/formaledited.JPG"
            />
            <AvatarFallback className="text-xl">JC</AvatarFallback>
          </Avatar>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          Hi, I&apos;m Charles
        </h1>

        <h2 className="mb-8 text-2xl font-medium text-muted-foreground md:text-3xl">
          Junior Developer
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Versatile Developer with professional experience building
          high-performance web and mobile applications. Specializing in the
          React ecosystem (Next.js, React Native) and backend integration with
          C#/.NET. I focus on creating scalable, user-centric solutions by
          bridging the gap between elegant frontend design and robust backend
          logic. Proven ability to adapt quickly to new technologies and deliver
          production-ready code in fast-paced environments
        </p>

        <div className="mb-10 flex justify-center gap-4">
          <InteractiveHoverButton
            rounded="sm"
            showIcons={false}
            onClick={() => {
              const target = document.getElementById("projects")
              if (target) {
                window.dispatchEvent(new Event("scroll-start"))
                const navbarHeight = 84
                const targetPosition =
                  target.getBoundingClientRect().top +
                  window.scrollY -
                  navbarHeight
                animate(window.scrollY, targetPosition, {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  onUpdate: (latest: number) => window.scrollTo(0, latest),
                  onComplete: () => {
                    window.dispatchEvent(new Event("scroll-end"))
                  },
                })
              }
            }}
          >
            View my work
          </InteractiveHoverButton>
          <InteractiveHoverButton
            rounded="sm"
            showIcons={false}
            onClick={() => {
              const target = document.getElementById("contact")
              if (target) {
                const targetPosition =
                  target.getBoundingClientRect().top + window.scrollY
                animate(window.scrollY, targetPosition, {
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  onUpdate: (latest: number) => window.scrollTo(0, latest),
                })
              }
            }}
          >
            Contact Me
          </InteractiveHoverButton>
        </div>

        <div className="flex justify-center gap-5">
          <a
            href="https://github.com/dingggjc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <GitHubLogoIcon className="h-6 w-6" />
          </a>
          <a
            href="mailto:charlesaciertojc@gmail.com"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
