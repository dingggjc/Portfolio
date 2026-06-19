"use client"

import { cn } from "@/lib/utils"
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
      className={cn("px-4 py-32", className)}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          Let's talk
        </h2>
        <p className="mb-10 text-base text-muted-foreground">
          Open to new opportunities. Reach out directly.
        </p>
        <div className="space-y-3">
          <a
            href={`mailto:${email}`}
            className="block text-xl font-semibold text-primary underline-offset-4 transition-colors hover:underline md:text-2xl"
          >
            {email}
          </a>
          <a
            href={`tel:${phone}`}
            className="block text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            +63 {phone.slice(1, 4)} {phone.slice(4, 7)} {phone.slice(7)}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactMe
