"use client"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Mail } from "lucide-react"
import { animate, motion, useReducedMotion } from "motion/react"
import { InteractiveHoverButton } from "../ui/interactive-hover-button"
import { Meteors } from "../ui/meteors"
import TechMarquee from "./TechMarquee"

function smoothScrollTo(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const pos = target.getBoundingClientRect().top + window.scrollY - 84
  window.dispatchEvent(new Event("scroll-start"))
  animate(window.scrollY, pos, {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (v: number) => window.scrollTo(0, v),
    onComplete: () => window.dispatchEvent(new Event("scroll-end")),
  })
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function Hero() {
  const reduce = useReducedMotion()

  function anim(delay: number) {
    if (reduce) return {}
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, delay, ease },
    }
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-69px)] flex-col overflow-hidden px-4 pt-20"
    >
      <Meteors number={20} className="-z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, oklch(0.6171 0.1375 39.0427 / 0.13) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.6171 0.1375 39.0427 / 0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 80% 20%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 80% 20%, black 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-12">
        <div className="w-full max-w-5xl -translate-y-8 text-center">
            <motion.p
              {...anim(0.02)}
              className="mb-5 font-mono text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase sm:text-sm"
            >
              Full Stack Developer
            </motion.p>

            <h1 className="mb-6 select-none">
              <motion.span
                {...anim(0.05)}
                className="inline whitespace-nowrap text-[clamp(2.1rem,4.7vw,5rem)] leading-[0.96] font-bold tracking-tight"
              >
                Jeason Charles&nbsp;
              </motion.span>
              <motion.span
                {...anim(0.13)}
                className="inline whitespace-nowrap text-[clamp(2.1rem,4.7vw,5rem)] leading-[0.96] font-bold tracking-tight text-primary"
              >
                Acierto
              </motion.span>
            </h1>

            <motion.div
              {...anim(0.21)}
              className="hidden"
            >
              <div className="h-px w-8 shrink-0 bg-primary/50" />
              <p className="font-mono text-sm tracking-wide text-muted-foreground">
                Web Developer / React · Next.js · C# .NET
              </p>
            </motion.div>

            <motion.p
              {...anim(0.21)}
              className="mx-auto mb-8 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground md:text-base"
            >
              I build thoughtful, production-ready web and mobile applications
              with React, Next.js, React Native, and .NET, from clean
              interfaces and reliable APIs through deployment.
            </motion.p>

            <motion.div
              {...anim(0.29)}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <InteractiveHoverButton
                rounded="sm"
                showIcons={false}
                onClick={() => smoothScrollTo("projects")}
              >
                Explore Projects
              </InteractiveHoverButton>

              <a
                href="/others/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-sm border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
              >
                View Résumé
              </a>

              <div className="flex items-center gap-4 border-l border-border pl-4">
                <a
                  href="https://github.com/dingggjc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHubLogoIcon className="h-5 w-5" />
                </a>
                <a
                  href="mailto:charlesaciertojc@gmail.com"
                  aria-label="Email"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
        </div>
      </div>
      <TechMarquee />
    </section>
  )
}
