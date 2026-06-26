"use client"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Mail } from "lucide-react"
import { animate, motion, useReducedMotion } from "motion/react"
import { InteractiveHoverButton } from "../ui/interactive-hover-button"

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
      className="relative flex min-h-dvh items-center overflow-hidden px-4 pt-20 pb-16"
    >
      {/* Ambient glow - upper right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, oklch(0.6171 0.1375 39.0427 / 0.13) 0%, transparent 70%)",
        }}
      />
      {/* Subtle dot grid */}
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

      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: prose */}
          <div className="flex-1">
            {/* Availability - mobile only */}
            <motion.div {...anim(0)} className="mb-8 lg:hidden">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  Available for work
                </span>
              </span>
            </motion.div>

            {/* Name */}
            <h1 className="mb-6 select-none">
              <motion.span
                {...anim(0.05)}
                className="block text-5xl leading-[0.92] font-bold tracking-tight md:text-7xl lg:text-8xl"
              >
                Charles
              </motion.span>
              <motion.span
                {...anim(0.13)}
                className="block text-5xl leading-[0.92] font-bold tracking-tight text-primary md:text-7xl lg:text-8xl"
              >
                Acierto
              </motion.span>
            </h1>

            {/* Role */}
            <motion.div
              {...anim(0.21)}
              className="mb-5 flex items-center gap-3"
            >
              <div className="h-px w-8 shrink-0 bg-primary/50" />
              <p className="font-mono text-sm tracking-wide text-muted-foreground">
                Web Developer / React · Next.js · C# .NET
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p
              {...anim(0.29)}
              className="mb-10 max-w-[44ch] text-base leading-relaxed text-muted-foreground"
            >
              Bridging clean React interfaces with robust .NET backends.
              Currently building at Repoint Solutions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...anim(0.37)}
              className="flex flex-wrap items-center gap-4"
            >
              <InteractiveHoverButton
                rounded="sm"
                showIcons={false}
                onClick={() => smoothScrollTo("projects")}
              >
                View Work
              </InteractiveHoverButton>

              <a
                href="/others/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-sm border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
              >
                View CV
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

          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden shrink-0 lg:block"
          >
            <div className="relative w-2xs overflow-hidden rounded-xl border border-border/50 bg-muted/20 font-mono shadow-lg">
              <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-[10px] tracking-wide text-muted-foreground/50">
                  info.sh
                </span>
              </div>

              <div className="space-y-4 p-5 text-[11.5px] leading-relaxed">
                <div>
                  <div className="text-muted-foreground/70">
                    <span className="text-primary/80">$ </span>whoami
                  </div>
                  <div className="mt-0.5 pl-3 text-[13px] font-semibold text-foreground">
                    Charles Acierto
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground/70">
                    <span className="text-primary/80">$ </span>cat stack.txt
                  </div>
                  <div className="mt-0.5 space-y-0.5 pl-3 text-foreground">
                    <div>React · Next.js · TypeScript</div>
                    <div>C# .NET · MySQL · Node.js</div>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground/70">
                    <span className="text-primary/80">$ </span>cat location.txt
                  </div>
                  <div className="mt-0.5 pl-3 text-foreground">Philippines</div>
                </div>

                <div>
                  <div className="text-muted-foreground/70">
                    <span className="text-primary/80">$ </span>status --check
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 pl-3">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-emerald-500">Available for work</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-muted-foreground/30">
                  <span className="text-primary/40">$ </span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
