"use client"

import { cn } from "@/lib/utils"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Mail } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

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
      className={cn("relative overflow-hidden px-4 py-32", className)}
    >
      {/* Radial amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.6171 0.1375 39.0427 / 0.08) 0%, transparent 70%)",
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.6171 0.1375 39.0427 / 0.05) 1px, transparent 1px)",
            "linear-gradient(to right, oklch(0.6171 0.1375 39.0427 / 0.05) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "64px 64px",
        }}
      />
      {/* Fade top and bottom edges into background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
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
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">
          Open to opportunities
        </p>

        <h2 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          Let's talk
        </h2>

        <p className="mb-10 text-base text-muted-foreground">
          Open to new roles and projects. Reach out directly.
        </p>

        <a
          href={`mailto:${email}`}
          className="group mb-10 inline-flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted/60 hover:text-primary"
        >
          <Mail className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
          {email}
        </a>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="https://github.com/dingggjc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GitHubLogoIcon className="h-4 w-4" />
            GitHub
          </a>
          <span className="h-px w-4 bg-border" aria-hidden />
          <a
            href={`tel:${phone}`}
            className="transition-colors hover:text-foreground"
          >
            +63 {phone.slice(1, 4)} {phone.slice(4, 7)} {phone.slice(7)}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactMe
