import { cn } from "@/lib/utils"
import Image from "next/image"

interface ExperienceItem {
  period: string
  title: string
  description: string
  company: string
  logo: string
}

interface Experience1Props {
  heading?: string
  buttonText?: string
  buttonUrl?: string
  experience?: ExperienceItem[]
  className?: string
}

const Experience = ({
  heading = "Experience",
  experience = [
    {
      period: "6 Months",
      title: "Frontend / Semi-Backend Developer",
      description:
        "Developed and maintained frontend features using React and Next.js. Assisted with backend logic and API integration using C# (.NET) and managed databases with MySQL.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "2 Months",
      title: "Pre-Employment Training (Frontend)",
      description:
        "Underwent intensive training focused on real-world frontend workflows, developing responsive interfaces, and strengthening software troubleshooting skills.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
    {
      period: "4 Months",
      title: "Internship - Frontend Developer",
      description:
        "Built UI components using React, React Native, and Tailwind CSS. Integrated APIs using TanStack Query and implemented form validation with Zod.",
      company: "Repoint Solutions",
      logo: "/assets/jpeg/RepointLogo.jpg",
    },
  ],
  className,
}: Experience1Props) => {
  return (
    <section
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-20",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl space-y-10 lg:space-y-12">
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Career
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight">{heading}</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            My professional journey in software development, highlighting key
            roles, technical milestones, and the projects I&apos;ve helped
            build.
          </p>
        </div>

        <div className="rounded-xl border border-border/40 bg-muted/50 p-8 shadow-sm md:p-10 lg:p-12">
          <ul>
            {experience.map((exp, index) => (
              <li
                key={index}
                className="flex flex-col justify-between border-b py-10 last:border-b-0 md:flex-row"
              >
                <div className="max-w-lg text-xl tracking-tighter lg:w-1/3">
                  {exp.period}
                </div>
                <div className="lg:w-1/3">
                  <h2 className="mb-4 text-2xl font-semibold tracking-tighter">
                    {exp.title}
                  </h2>
                  <p className="text-foreground/50">{exp.description}</p>
                </div>
                <div className="flex items-start justify-end gap-3 text-right lg:w-1/4">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={24}
                    height={24}
                    className="dark:invert"
                  />
                  {exp.company}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Experience
