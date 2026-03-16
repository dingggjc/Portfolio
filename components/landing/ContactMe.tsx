"use client"

import { cn } from "@/lib/utils"

import { Mail, Phone } from "lucide-react"

interface ContactMeProps {
  title?: string
  description?: string
  emailLabel?: string
  emailDescription?: string
  email?: string
  phoneLabel?: string
  phoneDescription?: string
  phone?: string
  className?: string
}

import { motion } from "motion/react"

const ContactMe = ({
  title = "Get in Touch",
  description = "I'm currently open to new opportunities. Feel free to reach out via email or phone.",
  emailLabel = "Email",
  emailDescription = "The best way to reach me for professional inquiries.",
  email = "charlesaciertojc@gmail.com",
  phoneLabel = "Phone",
  phoneDescription = "Available for calls or messages.",
  phone = "09264648501",
  className,
}: ContactMeProps) => {
  return (
    <section
      id="contact"
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-20",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto w-full max-w-6xl"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col space-y-4 pt-10 md:pt-16 lg:pt-24 lg:pr-10">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Contact
            </p>
            <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border border-border/40 bg-muted/50 p-8 shadow-sm">
              <Mail className="mb-4 h-5 w-5 text-muted-foreground hover:text-primary" />
              <p className="mb-1 font-medium">{emailLabel}</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {emailDescription}
              </p>
              <a
                href={`mailto:${email}`}
                className="font-semibold text-primary hover:underline"
              >
                {email}
              </a>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/50 p-8 shadow-sm">
              <Phone className="mb-4 h-5 w-5 text-muted-foreground hover:text-primary" />
              <p className="mb-1 font-medium">{phoneLabel}</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {phoneDescription}
              </p>
              <a
                href={`tel:${phone}`}
                className="font-semibold text-primary hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactMe
