"use client"

import { cn } from "@/lib/utils"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { ArrowUpRight, Mail, Phone } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { InteractiveGridPattern } from "../ui/interactive-grid-pattern"

interface ContactMeProps {
  email?: string
  phone?: string
  className?: string
}

const ContactMe = ({
  email = "charlesaciertojc@gmail.com",
  phone = "09264648501",
  className,
}: ContactMeProps) => {
  const reduce = useReducedMotion()

  return (
    <section
      id="contact"
      className={cn("relative isolate overflow-hidden px-4 py-32", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.6171 0.1375 39.0427 / 0.08) 0%, transparent 70%)",
        }}
      />
      <InteractiveGridPattern
        width={64}
        height={64}
        squares={[16, 8]}
        className="z-0 h-full w-full border-0"
        squaresClassName="stroke-primary/5 hover:fill-primary/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 20%, transparent 80%, var(--background) 100%)",
        }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="mb-5 font-mono text-xs font-medium tracking-[0.16em] text-primary uppercase">
          Open to opportunities
        </p>

        <h2 className="mx-auto max-w-xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Let&apos;s build something useful.
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Open to new roles and projects. Reach out directly.
        </p>

        <a
          href={`mailto:${email}`}
          className="group mt-10 inline-flex w-full items-center justify-between rounded-lg bg-primary px-5 py-4 text-left text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:min-w-96"
        >
          <span className="flex items-center gap-3">
            <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            {email}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <div className="mx-auto mt-4 grid max-w-md gap-3 sm:grid-cols-2">
          <a
            href="https://github.com/dingggjc"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-lg border border-border/80 bg-card/60 px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <GitHubLogoIcon className="h-4 w-4" />
              GitHub
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={`tel:${phone}`}
            className="group flex items-center justify-between rounded-lg border border-border/80 bg-card/60 px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              +63 {phone.slice(1, 4)} {phone.slice(4, 7)} {phone.slice(7)}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactMe
